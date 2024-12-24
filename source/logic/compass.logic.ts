import { CompassType, framesNumberDefault } from '../constants';
import {
  ChordCompass,
  Compass,
  PickingCompass,
  PickingFrame,
  ReferenceCompass,
  StrummingPattern,
  Tab,
} from '../types';

export const createChordCompass = (
  index: number,
  strummingPattern: StrummingPattern | undefined,
): ChordCompass => ({
  index,
  frames: Array.from({ length: strummingPattern?.framesNumber ?? 0 }, () => ''),
  sPatternIndex: strummingPattern?.index,
  type: CompassType.chord,
});

export const createPickingCompass = (index: number): PickingCompass => ({
  index,
  frames: Array.from({ length: framesNumberDefault }, createPickingFrame),
  framesNumber: framesNumberDefault,
  type: CompassType.picking,
});

export const createPickingFrame = (): PickingFrame => Array.from({ length: 6 }, () => '');

export const createReferenceCompass = (compass: Compass): ReferenceCompass => ({
  index: compass.index + 1,
  compassIndex: compass.type === CompassType.reference ? compass.compassIndex : compass.index,
  type: CompassType.reference,
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
      return compass.type !== CompassType.chord || compass.index !== compassIndex
        ? compass
        : {
            ...compass,
            frames: compass.frames.map((frame, fIndex) => {
              return fIndex !== frameIndex ? frame : value;
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
  const strummingPattern = tab.strummingPatterns.find(
    (sPattern) => sPattern.index === sPatternIndex,
  );
  if (!strummingPattern) {
    return tab;
  }

  return {
    ...tab,
    compasses: tab.compasses.map((compass) => {
      return compass.type !== CompassType.chord || compass.index !== compassIndex
        ? compass
        : {
            ...compass,
            sPatternIndex: sPatternIndex,
            frames: Array.from(
              { length: strummingPattern.framesNumber },
              (_, index) => compass.frames[index] ?? '',
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
      return compass.type !== CompassType.picking || compass.index !== compassIndex
        ? compass
        : {
            ...compass,
            frames: compass.frames.map((frame, fIndex) => {
              return fIndex !== frameIndex
                ? frame
                : [...frame].map((string, sIndex) => {
                    return sIndex !== stringIndex ? string : value;
                  });
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
      return compass.type !== CompassType.picking || compass.index !== compassIndex
        ? compass
        : {
            ...compass,
            frames: Array.from(
              { length: framesNumber },
              (_, index) => compass.frames[index] ?? createPickingFrame(),
            ),
            framesNumber,
          };
    }),
  };
};
