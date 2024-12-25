import { BarType, framesNumberDefault } from '../constants';
import {
  Bar,
  ChordBar,
  PickingBar,
  PickingFrame,
  ReferenceBar,
  StrummingPattern,
  Tab,
} from '../types';
import { createIndexedValuesArray } from './indexed-value.logic';

export const createChordCompass = (
  index: number,
  strummingPattern: StrummingPattern | undefined,
): ChordBar => ({
  frames: createIndexedValuesArray(strummingPattern?.framesNumber ?? 0, ''),
  index,
  sPatternIndex: strummingPattern?.index,
  type: BarType.chord,
});

export const createPickingCompass = (index: number): PickingBar => ({
  frames: Array.from({ length: framesNumberDefault }, (_, index) => createPickingFrame(index)),
  framesNumber: framesNumberDefault,
  index,
  type: BarType.picking,
});

export const createPickingFrame = (index: number): PickingFrame => ({
  index,
  strings: createIndexedValuesArray(6, ''),
});

export const createReferenceCompass = (bar: Bar): ReferenceBar => ({
  barIndex: bar.type === BarType.reference ? bar.barIndex : bar.index,
  index: bar.index + 1,
  type: BarType.reference,
});

export const updateChordCompass = (
  tab: Tab,
  barIndex: number,
  frameIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    bars: tab.bars.map((bar) => {
      return bar.type !== BarType.chord || bar.index !== barIndex
        ? bar
        : {
            ...bar,
            frames: bar.frames.map((frame) => {
              return frame.index !== frameIndex ? frame : { ...frame, value };
            }),
          };
    }),
  };
};

export const updateChordCompassFrames = (
  tab: Tab,
  barIndex: number,
  sPatternIndex: number,
): Tab => {
  const sPattern = tab.strummingPatterns.find((sPattern) => sPattern.index === sPatternIndex);
  if (!sPattern) {
    return tab;
  }

  return {
    ...tab,
    bars: tab.bars.map((bar) => {
      return bar.type !== BarType.chord || bar.index !== barIndex
        ? bar
        : {
            ...bar,
            sPatternIndex,
            frames: createIndexedValuesArray(
              sPattern.framesNumber,
              (index) => bar.frames[index]?.value ?? '',
            ),
          };
    }),
  };
};

export const updatePickingCompass = (
  tab: Tab,
  barIndex: number,
  frameIndex: number,
  stringIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    bars: tab.bars.map((bar) => {
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
    }),
  };
};

export const updatePickingCompassFrames = (
  tab: Tab,
  barIndex: number,
  framesNumber: number,
): Tab => {
  return {
    ...tab,
    bars: tab.bars.map((bar) => {
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
    }),
  };
};
