import { BarType, framesNumberDefault, stringsNumber } from '../constants';
import {
  Bar,
  BarBase,
  ChordBar,
  NonSectionBar,
  PickingBar,
  PickingFrame,
  ReferenceBar,
  Section,
  SectionBar,
  StrummingPattern,
} from '../types';
import {
  DiminishedBar,
  DiminishedChordBar,
  DiminishedNonSectionBar,
  DiminishedPickingBar,
} from '../types/diminished-bar.type';
import {
  createIndexedValuesArray,
  debugBarMovements,
  getIndexAfterMove,
  getIndexIncrease,
} from './indexed-value.operations';

const createPickingFrame = (index: number): PickingFrame => ({
  chordSupport: undefined,
  index,
  strings: createIndexedValuesArray(stringsNumber, ''),
});

export const barOperations = {
  addBar: <TBar extends Bar | NonSectionBar>(bars: TBar[], newBar: TBar): TBar[] => {
    const nextBars =
      bars.length === 0
        ? [newBar]
        : bars.reduce<TBar[]>((reduced, bar) => {
            const isLastBar = bar.index === bars.length - 1;

            const nextBar: TBar = {
              ...bar,
              index: getIndexIncrease(bar.index, newBar.index),
              ...(bar.type === BarType.reference
                ? {
                    barIndex: getIndexIncrease(bar.barIndex, newBar.index),
                  }
                : {}),
            };

            return [
              ...reduced,
              ...(bar.index < newBar.index
                ? isLastBar
                  ? [nextBar, newBar]
                  : [nextBar]
                : bar.index === newBar.index
                ? [newBar, nextBar]
                : [nextBar]),
            ];
          }, []);

    return nextBars;
  },

  augmentBar: <TDiminishedBar extends DiminishedBar | DiminishedNonSectionBar>(
    diminishedBar: TDiminishedBar,
    index: number,
  ): TDiminishedBar extends DiminishedNonSectionBar ? NonSectionBar : Bar => {
    if (diminishedBar.type === BarType.chord) {
      const chordBar: ChordBar = {
        ...diminishedBar,
        frames: diminishedBar.frames.map((frame, index) => {
          return { index, value: frame };
        }),
        index,
      };
      return chordBar;
    }

    if (diminishedBar.type === BarType.picking) {
      const pickingBar: PickingBar = {
        ...diminishedBar,
        frames: diminishedBar.frames.map((frame, frameIndex) => {
          return {
            ...frame,
            index: frameIndex,
            strings: frame.strings.map((string, stringIndex) => {
              return { index: stringIndex, value: string };
            }),
          };
        }),
        framesNumber: diminishedBar.frames.length,
        index,
      };
      return pickingBar;
    }

    const otherBar: SectionBar | ReferenceBar = { ...diminishedBar, index };
    return otherBar as NonSectionBar;
  },

  canMoveBarToPosition: (startIndex: number, endIndex: number) => {
    // A bar cannot be moved to the same position. That is:
    // - The position that is currently holding
    // - The position before the bar that comes immediately next
    return startIndex !== endIndex && startIndex + 1 !== endIndex;
  },

  createChordBar: (index: number, strummingPattern: StrummingPattern): ChordBar => {
    return {
      frames: createIndexedValuesArray(strummingPattern?.framesNumber ?? 0, ''),
      index,
      sPatternIndex: strummingPattern.index,
      repeats: undefined,
      type: BarType.chord,
    };
  },

  createPickingBar: (index: number): PickingBar => {
    return {
      frames: Array.from({ length: framesNumberDefault }, (_, index) => createPickingFrame(index)),
      framesNumber: framesNumberDefault,
      index,
      repeats: undefined,
      type: BarType.picking,
    };
  },

  createReferenceBar: (targetBar: Bar, index: number): ReferenceBar => {
    // If we are creating a copy in an earlier position, the new reference bar will shift the
    // pointed bar one position to the right; increasing the effective barIndex
    const isPointingToLaterPosition =
      index <= (targetBar.type === BarType.reference ? targetBar.barIndex : targetBar.index);

    const barIndex =
      (targetBar.type === BarType.reference ? targetBar.barIndex : targetBar.index) +
      +isPointingToLaterPosition;

    return {
      barIndex,
      index,
      repeats: undefined,
      type: BarType.reference,
    };
  },

  createSectionBar: (index: number, section: Section): SectionBar => {
    return {
      index,
      sectionIndex: section.index,
      repeats: undefined,
      type: BarType.section,
    };
  },

  diminishBar: <TBar extends Bar | NonSectionBar>(
    bar: TBar,
  ): TBar extends NonSectionBar ? DiminishedNonSectionBar : DiminishedBar => {
    if (bar.type === BarType.chord) {
      const { frames, index, ...rest } = bar as ChordBar;

      const diminishedChordBar: DiminishedChordBar = {
        ...rest,
        frames: frames.map((frame) => {
          return frame.value;
        }),
      };
      return diminishedChordBar;
    }

    if (bar.type === BarType.picking) {
      const { frames, framesNumber, index, ...barRest } = bar as PickingBar;

      const diminishedPickingBar: DiminishedPickingBar = {
        ...barRest,
        frames: frames.map((frame) => {
          const { index, strings, ...frameRest } = frame;
          return {
            ...frameRest,
            strings: strings.map((string) => {
              return string.value;
            }),
          };
        }),
      };
      return diminishedPickingBar;
    }

    const { index, ...rest } = bar as SectionBar | ReferenceBar;
    return rest as DiminishedNonSectionBar;
  },

  moveBar: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    startIndex: number,
    endIndex: number,
  ): TBar[] => {
    // When moving the bar to a later position, the removal of the bar from its current position
    // causes the endIndex to shift one position to the left; decreasing the effective endIndex
    const movingToLaterPosition = startIndex < endIndex;
    const effectiveEndIndex = movingToLaterPosition ? endIndex - 1 : endIndex;

    debugBarMovements && console.log('Moving bar', startIndex, 'to', effectiveEndIndex);

    const reorderedBars = [...bars];

    // Remove target bar from the current position
    const [targetBar] = reorderedBars.splice(startIndex, 1);

    // Insert target bar in the new position
    reorderedBars.splice(effectiveEndIndex, 0, targetBar);

    debugBarMovements &&
      console.log(
        'Indexes before re-indexing the bars',
        reorderedBars.map((b) => b.index),
      );

    const reIndexedBars = reorderedBars.map<TBar>((bar) => {
      return {
        ...bar,
        index: getIndexAfterMove(bar.index, startIndex, effectiveEndIndex),
        ...(bar.type === BarType.reference
          ? {
              barIndex: getIndexAfterMove(bar.barIndex, startIndex, effectiveEndIndex),
            }
          : {}),
      };
    }, []);

    debugBarMovements &&
      console.log(
        'Indexes after re-indexing the bars',
        reIndexedBars.map((b) => b.index),
      );

    return reIndexedBars;
  },

  rebaseChordBar: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    barIndex: number,
    sPattern: StrummingPattern,
  ): TBar[] => {
    return bars.map((bar) => {
      return bar.type !== BarType.chord || bar.index !== barIndex
        ? bar
        : {
            ...bar,
            sPatternIndex: sPattern.index,
            frames: createIndexedValuesArray(
              sPattern.framesNumber,
              (index) => bar.frames[index]?.value ?? '',
            ),
          };
    });
  },

  rebasePickingBar: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    barIndex: number,
    framesNumber: number,
  ): TBar[] => {
    return bars.map((bar) => {
      return bar.type !== BarType.picking || bar.index !== barIndex
        ? bar
        : {
            ...bar,
            frames: Array.from(
              { length: framesNumber },
              (_, index) => bar.frames[index] ?? createPickingFrame(index),
            ),
            framesNumber,
          };
    });
  },

  removeBar: <TBar extends Bar | NonSectionBar>(bars: TBar[], deletionIndex: number): TBar[] => {
    // Reference bars can point to a bar that is being deleted in a later position; we need
    // to compute the deleted count at each position prior to re-indexing the bars
    const { deletedCounts } = bars.reduce<{
      deletedCounts: { [key: number]: { isBarBeingDeleted: boolean; deleteCount: number } };
      total: number;
    }>(
      (reduced, bar) => {
        const isBarBeingDeleted =
          bar.index === deletionIndex ||
          (bar.type === BarType.reference && bar.barIndex === deletionIndex);

        const nextTotal = reduced.total + (isBarBeingDeleted ? 1 : 0);
        return {
          deletedCounts: {
            ...reduced.deletedCounts,
            [bar.index]: { isBarBeingDeleted, deleteCount: nextTotal },
          },
          total: nextTotal,
        };
      },
      { deletedCounts: {}, total: 0 },
    );

    const nextBars = bars.reduce<TBar[]>((reduced, bar) => {
      if (deletedCounts[bar.index].isBarBeingDeleted) {
        return reduced;
      }

      const nextBar: TBar = {
        ...bar,
        index: bar.index - deletedCounts[bar.index].deleteCount,
        ...(bar.type === BarType.reference
          ? {
              barIndex: bar.barIndex - deletedCounts[bar.barIndex].deleteCount,
            }
          : {}),
      };

      return [...reduced, nextBar];
    }, []);

    return nextBars;
  },

  setStrummingPattern: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    sPattern: StrummingPattern,
    matchingIndex: number | undefined,
  ): TBar[] => {
    return bars.map((bar) => {
      return bar.type === BarType.chord && bar.sPatternIndex === matchingIndex
        ? {
            ...bar,
            sPatternIndex: sPattern.index,
            frames: createIndexedValuesArray(
              sPattern.framesNumber,
              (index) => bar.frames[index]?.value ?? '',
            ),
          }
        : bar;
    });
  },

  updateChordFrame: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    barIndex: number,
    frameIndex: number,
    value: string,
  ): TBar[] => {
    return bars.map((bar) => {
      return bar.type !== BarType.chord || bar.index !== barIndex
        ? bar
        : {
            ...bar,
            frames: bar.frames.map((frame) => {
              return frame.index !== frameIndex ? frame : { ...frame, value };
            }),
          };
    });
  },

  updatePickingFrame: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    barIndex: number,
    frameIndex: number,
    stringIndex: number,
    value: string,
  ): TBar[] => {
    return bars.map((bar) => {
      return bar.type !== BarType.picking || bar.index !== barIndex
        ? bar
        : {
            ...bar,
            frames: bar.frames.map((frame) => {
              return frame.index !== frameIndex
                ? frame
                : {
                    ...frame,
                    chordSupport: stringIndex === frame.strings.length ? value : frame.chordSupport,
                    strings: frame.strings.map((string) => {
                      return string.index !== stringIndex ? string : { ...string, value };
                    }),
                  };
            }),
          };
    });
  },

  updateRepeats: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    barIndex: number,
    repeats: BarBase['repeats'],
  ): TBar[] => {
    return bars.map((bar) => {
      return bar.index !== barIndex
        ? bar
        : {
            ...bar,
            repeats,
          };
    });
  },
};
