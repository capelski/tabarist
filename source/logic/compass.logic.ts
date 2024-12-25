import { BarType, framesNumberDefault } from '../constants';
import {
  ChordCompass,
  Compass,
  PickingCompass,
  PickingFrame,
  ReferenceCompass,
  StrummingPattern,
  Tab,
} from '../types';
import { createIndexedValuesArray } from './indexed-value.logic';

export const createChordCompass = (
  index: number,
  strummingPattern: StrummingPattern | undefined,
): ChordCompass => ({
  index,
  frames: createIndexedValuesArray(strummingPattern?.framesNumber ?? 0, ''),
  sPatternIndex: strummingPattern?.index,
  type: BarType.chord,
});

export const createPickingCompass = (index: number): PickingCompass => ({
  index,
  frames: Array.from({ length: framesNumberDefault }, (_, index) => createPickingFrame(index)),
  framesNumber: framesNumberDefault,
  type: BarType.picking,
});

export const createPickingFrame = (index: number): PickingFrame => ({
  index,
  strings: createIndexedValuesArray(6, ''),
});

export const createReferenceCompass = (compass: Compass): ReferenceCompass => ({
  index: compass.index + 1,
  compassIndex: compass.type === BarType.reference ? compass.compassIndex : compass.index,
  type: BarType.reference,
});

export const updateChordCompass = (
  tab: Tab,
  compassIndex: number,
  frameIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    compasses: tab.compasses.map((compass) => {
      return compass.type !== BarType.chord || compass.index !== compassIndex
        ? compass
        : {
            ...compass,
            frames: compass.frames.map((frame) => {
              return frame.index !== frameIndex ? frame : { ...frame, value };
            }),
          };
    }),
  };
};

export const updateChordCompassFrames = (
  tab: Tab,
  compassIndex: number,
  sPatternIndex: number,
): Tab => {
  const sPattern = tab.strummingPatterns.find((sPattern) => sPattern.index === sPatternIndex);
  if (!sPattern) {
    return tab;
  }

  return {
    ...tab,
    compasses: tab.compasses.map((compass) => {
      return compass.type !== BarType.chord || compass.index !== compassIndex
        ? compass
        : {
            ...compass,
            sPatternIndex,
            frames: createIndexedValuesArray(
              sPattern.framesNumber,
              (index) => compass.frames[index]?.value ?? '',
            ),
          };
    }),
  };
};

export const updatePickingCompass = (
  tab: Tab,
  compassIndex: number,
  frameIndex: number,
  stringIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    compasses: tab.compasses.map((compass) => {
      return compass.type !== BarType.picking || compass.index !== compassIndex
        ? compass
        : {
            ...compass,
            frames: compass.frames.map((frame) => {
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
  compassIndex: number,
  framesNumber: number,
): Tab => {
  return {
    ...tab,
    compasses: tab.compasses.map((compass) => {
      return compass.type !== BarType.picking || compass.index !== compassIndex
        ? compass
        : {
            ...compass,
            frames: Array.from(
              { length: framesNumber },
              (_, index) => compass.frames[index] ?? createPickingFrame(index),
            ),
            framesNumber,
          };
    }),
  };
};
