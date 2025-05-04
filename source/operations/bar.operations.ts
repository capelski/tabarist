import { BarType, slotsDefault, slotValueOptions, stringsNumber } from '../constants';
import {
  Bar,
  BarBase,
  ChordBar,
  DiminishedBar,
  DiminishedChordBar,
  DiminishedNonSectionBar,
  DiminishedPickingBar,
  DiminishedReferenceBar,
  DiminishedSectionBar,
  NonSectionBar,
  PickingBar,
  PositionOperation,
  ReferenceBar,
  Rhythm,
  SectionBar,
} from '../types';
import { debugBarMovements, getIndexAfterMove, getIndexIncrease } from './indexed-value.operations';
import { slotOperations } from './slot.operations';

/** Used to propagate rhythm slot changes to the bars which use the rhythm  */
const setBarSlotSize = <TBar extends Bar | NonSectionBar>(
  bars: TBar[],
  rhythmIndex: number,
  size: number,
  indexesPath: number[],
): TBar[] => {
  return bars.map((bar) => {
    return bar.type === BarType.chord && bar.rhythmIndex === rhythmIndex
      ? {
          ...bar,
          slots: slotOperations.setSlotSize(bar.slots, size, indexesPath),
        }
      : bar.type === BarType.picking && bar.rhythmIndex === rhythmIndex
      ? {
          ...bar,
          chordSupport: slotOperations.setSlotSize(bar.chordSupport, size, indexesPath),
          strings: bar.strings.map((string) => ({
            index: string.index,
            slots: slotOperations.setSlotSize(string.slots, size, indexesPath),
          })),
        }
      : bar.type === BarType.section
      ? {
          ...bar,
          bars: setBarSlotSize(bar.bars, rhythmIndex, size, indexesPath),
        }
      : bar;
  });
};

const augmentBar = <TDiminishedBar extends DiminishedBar | DiminishedNonSectionBar>(
  diminishedBar: TDiminishedBar,
  index: number,
): TDiminishedBar extends DiminishedNonSectionBar ? NonSectionBar : Bar => {
  if (diminishedBar.type === BarType.chord) {
    const chordBar: ChordBar = {
      ...diminishedBar,
      index,
      ...(diminishedBar.rhythmIndex !== undefined
        ? {
            rhythmIndex: diminishedBar.rhythmIndex,
            rhythmSlots: undefined,
          }
        : {
            rhythmIndex: undefined,
            rhythmSlots: diminishedBar.rhythmSlots.map(slotOperations.augmentSlot),
          }),
      slots: diminishedBar.slots.map(slotOperations.augmentSlot),
    };
    return chordBar;
  }

  if (diminishedBar.type === BarType.picking) {
    const pickingBar: PickingBar = {
      ...diminishedBar,
      index,
      chordSupport: diminishedBar.chordSupport.map(slotOperations.augmentSlot),
      strings: diminishedBar.strings.map((string, index) => {
        return {
          index,
          slots: string.slots.map(slotOperations.augmentSlot),
        };
      }),
    };

    return pickingBar;
  }

  if (diminishedBar.type === BarType.section) {
    const sectionBar: SectionBar = {
      ...diminishedBar,
      index,
      bars: diminishedBar.bars.map(augmentBar),
    };
    return sectionBar as any;
  }

  const referenceBar: ReferenceBar = { ...diminishedBar, index };
  return referenceBar;
};

const diminishBar = <TBar extends Bar | NonSectionBar>(
  bar: TBar,
): TBar extends NonSectionBar ? DiminishedNonSectionBar : DiminishedBar => {
  if (bar.type === BarType.chord) {
    const { index, slots, rhythmIndex, rhythmSlots, ...rest } = bar as ChordBar;

    const diminishedChordBar: DiminishedChordBar = {
      ...rest,
      ...(rhythmIndex !== undefined
        ? { rhythmIndex }
        : { rhythmSlots: rhythmSlots.map(slotOperations.diminishSlot) }),
      slots: slots.map(slotOperations.diminishSlot),
    };
    return diminishedChordBar;
  }

  if (bar.type === BarType.picking) {
    const { index, chordSupport, strings, ...barRest } = bar as PickingBar;

    const diminishedPickingBar: DiminishedPickingBar = {
      ...barRest,
      chordSupport: chordSupport.map(slotOperations.diminishSlot),
      strings: strings.map((string) => ({
        slots: string.slots.map(slotOperations.diminishSlot),
      })),
    };
    return diminishedPickingBar;
  }

  if (bar.type === BarType.section) {
    const { bars, index, ...rest } = bar as SectionBar;
    const diminishedSectionBar: DiminishedSectionBar = { ...rest, bars: bars.map(diminishBar) };
    return diminishedSectionBar as any;
  }

  const { index, ...rest } = bar as ReferenceBar;
  const diminishedReferenceBar: DiminishedReferenceBar = { ...rest };
  return diminishedReferenceBar;
};

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

  augmentBar,

  canMoveBarToPosition: (startIndex: number, endIndex: number) => {
    // A bar cannot be moved to the same position. That is:
    // - The position that is currently holding
    // - The position before the bar that comes immediately next
    return startIndex !== endIndex && startIndex + 1 !== endIndex;
  },

  createChordBar: (index: number): ChordBar => {
    return {
      index,
      repeats: undefined,
      rhythmIndex: undefined,
      rhythmSlots: slotOperations.createSlots(slotsDefault, (index) => {
        return slotOperations.createValueSlot(index, slotValueOptions[1]);
      }),
      slots: slotOperations.createSlots(slotsDefault),
      type: BarType.chord,
    };
  },

  createPickingBar: (index: number): PickingBar => {
    return {
      chordSupport: slotOperations.createSlots(slotsDefault),
      index,
      repeats: undefined,
      strings: Array.from({ length: stringsNumber }, (_, index) => {
        return { index, slots: slotOperations.createSlots(slotsDefault) };
      }),
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

  createSectionBar: (index: number): SectionBar => {
    return {
      bars: [],
      index,
      name: 'Unnamed section',
      repeats: undefined,
      type: BarType.section,
    };
  },

  diminishBar,

  isOperationInSection: (
    positionOperation: PositionOperation,
    parentSection: SectionBar | undefined,
  ) => {
    return positionOperation.sectionIndex === parentSection?.index;
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

  setBarRhythm: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    barIndex: number,
    rhythm: Rhythm,
  ): TBar[] => {
    return bars.map((bar) => {
      return bar.type === BarType.chord && bar.index === barIndex
        ? {
            ...bar,
            rhythmIndex: rhythm.index,
            rhythmSlots: undefined,
            slots: slotOperations.copyStructure(rhythm.slots, bar.slots),
          }
        : bar.type === BarType.picking && bar.index === barIndex
        ? {
            ...bar,
            chordSupport: slotOperations.copyStructure(rhythm.slots, bar.chordSupport),
            rhythmIndex: rhythm.index,
            strings: bar.strings.map((string) => ({
              index: string.index,
              slots: slotOperations.copyStructure(rhythm.slots, string.slots),
            })),
          }
        : bar;
    });
  },

  setBarSlotSize,

  setBarSlotsSize: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    barIndex: number,
    size: number,
    indexesPath: number[],
    rhythm: Rhythm | undefined,
  ): TBar[] => {
    return bars.map((bar) => {
      return bar.type === BarType.chord && bar.index === barIndex
        ? {
            ...bar,
            rhythmIndex: undefined,
            rhythmSlots: slotOperations.setSlotSize(
              rhythm?.slots ?? bar.rhythmSlots ?? bar.slots,
              size,
              indexesPath,
            ),
            slots: slotOperations.setSlotSize(bar.slots, size, indexesPath),
          }
        : bar.type === BarType.picking && bar.index === barIndex
        ? {
            ...bar,
            chordSupport: slotOperations.setSlotSize(bar.chordSupport, size, indexesPath),
            rhythmIndex: undefined,
            strings: bar.strings.map((string) => {
              return {
                index: string.index,
                slots: slotOperations.setSlotSize(string.slots, size, indexesPath),
              };
            }),
          }
        : bar;
    });
  },

  setChordBarSlotValue: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    barIndex: number,
    value: string,
    indexesPath: number[],
    property: 'slots' | 'rhythmSlots',
  ): TBar[] => {
    return bars.map((bar) => {
      return bar.type === BarType.chord && bar.index === barIndex
        ? {
            ...bar,
            [property]:
              bar[property] && slotOperations.setSlotValue(bar[property], value, indexesPath),
          }
        : bar;
    });
  },

  setPickingBarSlotValue: <TBar extends Bar | NonSectionBar>(
    bars: TBar[],
    barIndex: number,
    stringIndex: number | 'chordSupport',
    value: string,
    indexesPath: number[],
  ): TBar[] => {
    return bars.map((bar) => {
      return bar.type !== BarType.picking || bar.index !== barIndex
        ? bar
        : {
            ...bar,
            chordSupport:
              stringIndex === 'chordSupport'
                ? slotOperations.setSlotValue(bar.chordSupport, value, indexesPath)
                : bar.chordSupport,
            strings:
              stringIndex === 'chordSupport'
                ? bar.strings
                : bar.strings.map((string) => {
                    return stringIndex !== string.index
                      ? string
                      : {
                          index: string.index,
                          slots: slotOperations.setSlotValue(string.slots, value, indexesPath),
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
