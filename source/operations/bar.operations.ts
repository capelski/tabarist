import { BarType, framesNumberDefault } from '../constants';
import {
  Bar,
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
  createIndexedValuesArray,
  getIndexDecrease,
  getIndexIncrease,
} from './indexed-value.operations';

const addBar = <TBar extends Bar | NonSectionBar>(bars: TBar[], newBar: TBar): TBar[] => {
  return bars.length === 0
    ? [newBar]
    : bars.reduce((reduced, bar) => {
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
};

export const createChordBar = (
  index: number,
  strummingPattern: StrummingPattern | undefined,
): ChordBar => ({
  frames: createIndexedValuesArray(strummingPattern?.framesNumber ?? 0, ''),
  index,
  sPatternIndex: strummingPattern?.index,
  type: BarType.chord,
});

export const createPickingBar = (index: number): PickingBar => ({
  frames: Array.from({ length: framesNumberDefault }, (_, index) => createPickingFrame(index)),
  framesNumber: framesNumberDefault,
  index,
  type: BarType.picking,
});

export const createPickingFrame = (index: number): PickingFrame => ({
  index,
  strings: createIndexedValuesArray(6, ''),
});

export const createReferenceBar = (bar: Bar): ReferenceBar => ({
  barIndex: bar.type === BarType.reference ? bar.barIndex : bar.index,
  index: bar.index + 1,
  type: BarType.reference,
});

export const createSectionBar = (index: number, section: Section | undefined): SectionBar => ({
  index,
  sectionIndex: section?.index,
  type: BarType.section,
});

const rebaseChordBar = <TBar extends Bar | NonSectionBar>(
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
};

const rebasePickingBar = <TBar extends Bar | NonSectionBar>(
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
};

const removeBar = <TBar extends Bar | NonSectionBar>(
  bars: TBar[],
  deletionIndex: number,
): TBar[] => {
  const { nextBars } = bars.reduce(
    (reduced, bar) => {
      if (
        bar.index === deletionIndex ||
        (bar.type === BarType.reference && bar.barIndex === deletionIndex)
      ) {
        return {
          deletedCount: reduced.deletedCount + 1,
          nextBars: reduced.nextBars,
        };
      }

      const nextBar: TBar = {
        ...bar,
        index: getIndexDecrease(bar.index, deletionIndex, reduced.deletedCount),
        ...(bar.type === BarType.reference
          ? {
              barIndex: getIndexDecrease(bar.barIndex, deletionIndex, reduced.deletedCount),
            }
          : {}),
      };

      return {
        deletedCount: reduced.deletedCount,
        nextBars: [...reduced.nextBars, nextBar],
      };
    },
    { deletedCount: 0, nextBars: [] },
  );

  return nextBars;
};

const setStrummingPattern = <TBar extends Bar | NonSectionBar>(
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
};

const updateChordFrame = <TBar extends Bar | NonSectionBar>(
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
};

const updatePickingFrame = <TBar extends Bar | NonSectionBar>(
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
                  strings: frame.strings.map((string) => {
                    return string.index !== stringIndex ? string : { ...string, value };
                  }),
                };
          }),
        };
  });
};

export const barOperations = {
  addBar,
  rebaseChordBar,
  rebasePickingBar,
  removeBar,
  setStrummingPattern,
  updateChordFrame,
  updatePickingFrame,
};
