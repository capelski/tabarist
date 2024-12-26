import { BarType, framesNumberDefault } from '../constants';
import { Bar, ChordBar, PickingBar, PickingFrame, ReferenceBar, StrummingPattern } from '../types';
import {
  createIndexedValuesArray,
  getIndexDecrease,
  getIndexIncrease,
} from './indexed-value.logic';

export const addBarToGroup = (bars: Bar[], newBar: Bar): Bar[] => {
  return bars.length === 0
    ? [newBar]
    : bars.reduce((reduced, bar) => {
        const isLastBar = bar.index === bars.length - 1;

        const nextBar: Bar = {
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

const rebaseChordBar = (bars: Bar[], barIndex: number, sPattern: StrummingPattern): Bar[] => {
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

const rebasePickingBar = (bars: Bar[], barIndex: number, framesNumber: number): Bar[] => {
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

export const removeBarFromGroup = (bars: Bar[], deletionIndex: number): Bar[] => {
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

      const nextBar: Bar = {
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

const updateChordFrame = (
  bars: Bar[],
  barIndex: number,
  frameIndex: number,
  value: string,
): Bar[] => {
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

const updatePickingFrame = (
  bars: Bar[],
  barIndex: number,
  frameIndex: number,
  stringIndex: number,
  value: string,
): Bar[] => {
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

export const barService = {
  rebaseChordBar,
  rebasePickingBar,
  updateChordFrame,
  updatePickingFrame,
};
