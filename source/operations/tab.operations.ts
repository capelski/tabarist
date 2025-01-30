import { nanoid } from 'nanoid';
import { BarType, bodyMargin, characterWidth, NonReferenceBarType, ViewMode } from '../constants';
import { User } from '../firebase';
import { Bar, BarBase, NonSectionBar, Section, StrummingPattern, Tab } from '../types';
import { DiminishedTab } from '../types/diminished-tab.type';
import {
  augmentBar,
  barOperations,
  createChordBar,
  createPickingBar,
  createReferenceBar,
  createSectionBar,
  diminishBar,
} from './bar.operations';
import { getIndexDecrease } from './indexed-value.operations';
import { sectionOperations } from './section.operations';
import { sPatternOperations } from './strumming-pattern.operations';

type BarAggregation = {
  longestBarAdaptive: number;
  longestBarUniform: number;
};

type FrameAggregation = {
  longestFrame: number;
  totalLength: number;
};

const getValueLength = (value: string) => {
  return value.length || 1;
};

export const augmentTab = (diminishedTab: DiminishedTab): Tab => {
  return {
    ...diminishedTab,
    activeFrame: undefined,
    bars: diminishedTab.bars.map((bar, index) => augmentBar(bar, index)),
    sections: diminishedTab.sections.map((section, index) => {
      return {
        ...section,
        bars: section.bars.map((bar, index) => augmentBar(bar, index)),
        index,
      };
    }),
    strummingPatterns: diminishedTab.strummingPatterns.map((sPattern, index) => {
      return {
        ...sPattern,
        frames: sPattern.frames.map((frame, index) => {
          return { index, value: frame };
        }),
        framesNumber: sPattern.frames.length,
        index,
      };
    }),
  };
};

export const diminishTab = (tab: Tab): DiminishedTab => {
  return {
    ...tab,
    bars: tab.bars.map(diminishBar),
    sections: tab.sections.map((section) => {
      const { bars, index, ...rest } = section;

      return {
        ...rest,
        bars: bars.map(diminishBar),
      };
    }),
    strummingPatterns: tab.strummingPatterns.map((sPattern) => {
      const { frames, framesNumber, index, ...rest } = sPattern;

      return {
        ...rest,
        frames: frames.map((frame) => {
          return frame.value;
        }),
      };
    }),
  };
};

const applyBarsOperation = (
  tab: Tab,
  barsModifier: <TBar extends Bar | NonSectionBar>(bars: TBar[]) => TBar[],
  inSection?: Section,
): Tab => {
  return inSection
    ? {
        ...tab,
        copying: undefined,
        moving: undefined,
        sections: tab.sections.map((section) =>
          section.index === inSection.index
            ? {
                ...section,
                bars: barsModifier(section.bars),
              }
            : section,
        ),
      }
    : {
        ...tab,
        copying: undefined,
        moving: undefined,
        bars: barsModifier(tab.bars),
      };
};

export const tabOperations = {
  addBar: (tab: Tab, index: number, type: NonReferenceBarType, inSection?: Section): Tab => {
    let nextTab = { ...tab };

    if (type === BarType.chord && tab.strummingPatterns.length === 0) {
      nextTab.strummingPatterns = [sPatternOperations.create(0)];
    } else if (type === BarType.section && tab.sections.length === 0) {
      nextTab.sections = [sectionOperations.create(0)];
    }

    return applyBarsOperation(
      nextTab,
      (bars) => {
        const newBar =
          type === BarType.chord
            ? createChordBar(index, nextTab.strummingPatterns[0])
            : type === BarType.picking
            ? createPickingBar(index)
            : createSectionBar(index, nextTab.sections[0]);

        return barOperations.addBar(bars, newBar as any);
      },
      inSection,
    );
  },

  addSection: (tab: Tab): Tab => {
    const section = sectionOperations.create(tab.sections.length);

    return {
      ...tab,
      sections: [...tab.sections, section],
    };
  },

  addStrummingPattern: (tab: Tab): Tab => {
    const sPattern = sPatternOperations.create(tab.strummingPatterns.length);

    return {
      ...tab,
      strummingPatterns: [...tab.strummingPatterns, sPattern],
      bars: barOperations.setStrummingPattern(tab.bars, sPattern, undefined),
      sections: tab.sections.map((section) => ({
        ...section,
        bars: barOperations.setStrummingPattern(section.bars, sPattern, undefined),
      })),
    };
  },

  cancelPositionOperation: (tab: Tab): Tab => {
    return {
      ...tab,
      copying: undefined,
      moving: undefined,
    };
  },

  changeSection: (tab: Tab, barIndex: number, sectionIndex: number): Tab => {
    return {
      ...tab,
      bars: tab.bars.map((bar) => {
        return bar.type === BarType.section && bar.index === barIndex
          ? {
              ...bar,
              sectionIndex,
            }
          : bar;
      }),
    };
  },

  copyBarEnd: (tab: Tab, endIndex: number, inSection?: Section): Tab => {
    if (!tab.copying || !sectionOperations.isOperationInSection(tab.copying, inSection)) {
      return tab;
    }

    const { copying } = tab;
    const nextTab = { ...tab, copying: undefined };

    return applyBarsOperation(
      nextTab,
      (bars) => {
        const targetBar = bars[copying.startIndex];
        const newBar =
          targetBar.type === BarType.section
            ? createSectionBar(
                endIndex,
                tab.sections.find((s) => targetBar.sectionIndex === s.index)!,
              )
            : createReferenceBar(targetBar, endIndex);
        return barOperations.addBar(bars, newBar as any);
      },
      inSection,
    );
  },

  copyBarStart: (tab: Tab, startIndex: number, sectionIndex: number | undefined): Tab => {
    return {
      ...tab,
      copying: {
        sectionIndex,
        startIndex,
      },
    };
  },

  create: (ownerId: User['uid']): Tab => ({
    activeFrame: undefined,
    bars: [],
    copying: undefined,
    id: nanoid(),
    moving: undefined,
    ownerId,
    sections: [],
    strummingPatterns: [],
    title: 'Unnamed tab',
  }),

  getLongestBarWidth: (tab: Tab, windowWidth: number, viewMode: ViewMode) => {
    const bars = [
      ...tab.bars,
      ...tab.sections.map((s) => s.bars).reduce((reduced, bars) => [...reduced, ...bars], []),
    ].filter((b) => b.type === BarType.chord || b.type === BarType.picking);

    const minimumWidth = 140; // Used on empty bars and tabs with no bars

    const { longestBarAdaptive, longestBarUniform } = bars.reduce<BarAggregation>(
      (barsReduced, bar) => {
        const { longestFrame, totalLength } = (
          bar.type === BarType.chord
            ? bar.frames.map((frame) => {
                const strummingPattern = tab.strummingPatterns.find(
                  (sp) => sp.index === bar.sPatternIndex,
                );
                const strummingFrame = strummingPattern?.frames[frame.index].value ?? '';
                const effectiveValue =
                  strummingFrame.length > frame.value.length ? strummingFrame : frame.value;
                return getValueLength(effectiveValue);
              })
            : bar.frames.map((frame) => {
                return frame.strings.reduce((stringLength, string) => {
                  return Math.max(stringLength, getValueLength(string.value));
                }, 0);
              })
        ).reduce<FrameAggregation>(
          (lengthsReduced, currentLength) => {
            return {
              longestFrame: Math.max(lengthsReduced.longestFrame, currentLength),
              totalLength: lengthsReduced.totalLength + currentLength,
            };
          },
          { longestFrame: 0, totalLength: 0 },
        );

        const barLengthAdaptive = characterWidth * totalLength;
        const barLengthUniform = characterWidth * longestFrame * bar.frames.length;

        return {
          longestBarAdaptive: Math.max(barsReduced.longestBarAdaptive, barLengthAdaptive),
          longestBarUniform: Math.max(barsReduced.longestBarUniform, barLengthUniform),
        };
      },
      { longestBarAdaptive: minimumWidth, longestBarUniform: minimumWidth },
    );

    const effectiveWindowWidth = windowWidth - bodyMargin * 2;

    const maxBarsAdaptive = Math.max(1, Math.floor(effectiveWindowWidth / longestBarAdaptive));
    const barsPerLineAdaptive =
      maxBarsAdaptive >= 16
        ? 16
        : maxBarsAdaptive >= 8
        ? 8
        : maxBarsAdaptive >= 4
        ? 4
        : maxBarsAdaptive >= 2
        ? 2
        : 1;

    const maxBarsUniform = Math.max(1, Math.floor(effectiveWindowWidth / longestBarUniform));
    const barsPerLineUniform =
      maxBarsUniform >= 16
        ? 16
        : maxBarsUniform >= 8
        ? 8
        : maxBarsUniform >= 4
        ? 4
        : maxBarsUniform >= 2
        ? 2
        : 1;

    const barWidth =
      Math.floor(
        (effectiveWindowWidth * 100) /
          (viewMode === ViewMode.adaptive ? barsPerLineAdaptive : barsPerLineUniform),
      ) / 100;
    return { areModesEquivalent: barsPerLineAdaptive === barsPerLineUniform, barWidth };
  },

  moveBarEnd: (tab: Tab, endIndex: number, inSection?: Section): Tab => {
    if (!tab.moving || !sectionOperations.isOperationInSection(tab.moving, inSection)) {
      return tab;
    }

    const { moving } = tab;
    const nextTab = { ...tab, movement: undefined };

    return applyBarsOperation(
      nextTab,
      (bars) => barOperations.moveBar(bars, moving.startIndex, endIndex),
      inSection,
    );
  },

  moveBarStart: (tab: Tab, startIndex: number, sectionIndex: number | undefined): Tab => {
    return {
      ...tab,
      moving: {
        sectionIndex,
        startIndex,
      },
    };
  },

  rebaseChordBar: (tab: Tab, barIndex: number, sPatternIndex: number, inSection?: Section): Tab => {
    const sPattern = tab.strummingPatterns.find((sPattern) => sPattern.index === sPatternIndex);
    if (!sPattern) {
      return tab;
    }

    return applyBarsOperation(
      tab,
      (bars) => barOperations.rebaseChordBar(bars, barIndex, sPattern),
      inSection,
    );
  },

  rebasePickingBar: (
    tab: Tab,
    barIndex: number,
    framesNumber: number,
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.rebasePickingBar(bars, barIndex, framesNumber),
      inSection,
    );
  },

  removeBar: (tab: Tab, deletionIndex: number, inSection?: Section): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.removeBar(bars, deletionIndex),
      inSection,
    );
  },

  removeSection: (tab: Tab, deletionIndex: number): Tab => {
    if (!sectionOperations.canDelete(tab, deletionIndex)) {
      return tab;
    }

    return {
      ...tab,
      bars: tab.bars.map((bar) => {
        return bar.type === BarType.section
          ? { ...bar, sectionIndex: getIndexDecrease(bar.sectionIndex, deletionIndex, 1) }
          : bar;
      }),
      sections: tab.sections.reduce<Section[]>((reduced, section) => {
        return section.index === deletionIndex
          ? reduced
          : [
              ...reduced,
              {
                ...section,
                index: getIndexDecrease(section.index, deletionIndex, 1),
              },
            ];
      }, []),
    };
  },

  removeSPattern: (tab: Tab, deletionIndex: number): Tab => {
    if (!sPatternOperations.canDelete(tab, deletionIndex)) {
      return tab;
    }

    const processBars = <TBar extends Bar | NonSectionBar>(bars: TBar[]): TBar[] => {
      return bars.map((bar) => {
        return bar.type === BarType.chord
          ? { ...bar, sPatternIndex: getIndexDecrease(bar.sPatternIndex, deletionIndex, 1) }
          : bar;
      });
    };

    return {
      ...tab,
      bars: processBars(tab.bars),
      sections: tab.sections.map((section) => {
        return { ...section, bars: processBars(section.bars) };
      }),
      strummingPatterns: tab.strummingPatterns.reduce<StrummingPattern[]>((reduced, sPattern) => {
        return sPattern.index === deletionIndex
          ? reduced
          : [
              ...reduced,
              {
                ...sPattern,
                index: getIndexDecrease(sPattern.index, deletionIndex, 1),
              },
            ];
      }, []),
    };
  },

  renameSection: (tab: Tab, sectionIndex: number, name: string): Tab => {
    return {
      ...tab,
      sections: tab.sections.map((section) => {
        return section.index === sectionIndex ? { ...section, name } : section;
      }),
    };
  },

  renameStrummingPattern: (tab: Tab, sPatternIndex: number, name: string): Tab => {
    return {
      ...tab,
      strummingPatterns: tab.strummingPatterns.map((sPattern) => {
        return sPattern.index === sPatternIndex ? { ...sPattern, name } : sPattern;
      }),
    };
  },

  updateChordFrame: (
    tab: Tab,
    barIndex: number,
    frameIndex: number,
    value: string,
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.updateChordFrame(bars, barIndex, frameIndex, value),
      inSection,
    );
  },

  updatePickingFrame: (
    tab: Tab,
    barIndex: number,
    frameIndex: number,
    stringIndex: number,
    value: string,
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.updatePickingFrame(bars, barIndex, frameIndex, stringIndex, value),
      inSection,
    );
  },

  updateRepeats: (
    tab: Tab,
    barIndex: number,
    repeats: BarBase['repeats'],
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.updateRepeats(bars, barIndex, repeats),
      inSection,
    );
  },

  updateTitle: (tab: Tab, title: string): Tab => {
    return {
      ...tab,
      title,
    };
  },
};
