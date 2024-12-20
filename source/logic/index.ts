import { nanoid } from 'nanoid';
import { editIndexDefault } from '../constants';
import { Compass, CompassReference, Frame, PickingCompass, Tab } from '../types';

export const addCompassToTab = (tab: Tab, newCompass: Compass): Tab => {
  const nextCompasses = tab.compasses.reduce((reduced, compass) => {
    const isLastCompass = compass.index === tab.compasses.length;

    const nextCompass: Compass = {
      ...compass,
      index: getIndexIncrease(compass.index, newCompass.index),
      ...(compass.type === 'reference'
        ? {
            reference: getIndexIncrease(compass.reference, newCompass.index),
          }
        : {}),
    };

    return [
      ...reduced,
      ...(compass.index < newCompass.index
        ? isLastCompass
          ? [nextCompass, newCompass]
          : [nextCompass]
        : compass.index === newCompass.index
        ? [newCompass, nextCompass]
        : [nextCompass]),
    ];
  }, []);

  return {
    ...tab,
    compasses: nextCompasses,
    editIndex:
      tab.editIndex === editIndexDefault
        ? tab.editIndex
        : getIndexIncrease(tab.editIndex, newCompass.index),
  };
};

export const arrayIndexToCompassIndex = (arrayIndex: number) => arrayIndex + 1;

export const compassIndexToArrayIndex = (compassIndex: number) => compassIndex - 1;

export const createCompassReference = (compass: Compass): CompassReference => ({
  index: compass.index + 1,
  reference: compass.type === 'compass' ? compass.index : compass.reference,
  type: 'reference',
});

export const createFrame = (): Frame => Array.from({ length: 6 }, () => '');

export const createPickingCompass = (index: number): PickingCompass => ({
  index,
  frames: Array.from({ length: 8 }, createFrame),
  type: 'compass',
});

export const createTab = (): Tab => ({
  compasses: [createPickingCompass(1)],
  editIndex: editIndexDefault,
  id: nanoid(),
  title: 'Unnamed tab',
});

export const getIndexDecrease = (
  currentIndex: number,
  deletionIndex: number,
  deletedCount: number,
) => {
  return currentIndex < deletionIndex ? currentIndex : currentIndex - deletedCount;
};

export const getIndexIncrease = (currentIndex: number, insertionIndex: number) => {
  return currentIndex < insertionIndex ? currentIndex : currentIndex + 1;
};

export const removeCompassFromTab = (tab: Tab, deletionIndex: number): Tab => {
  const { editIndex, nextCompasses } = tab.compasses.reduce(
    (reduced, compass) => {
      if (
        compass.index === deletionIndex ||
        (compass.type === 'reference' && compass.reference === deletionIndex)
      ) {
        return {
          deletedCount: reduced.deletedCount + 1,
          editIndex: tab.editIndex === compass.index ? editIndexDefault : reduced.editIndex,
          nextCompasses: reduced.nextCompasses,
        };
      }

      const nextCompass: Compass = {
        ...compass,
        index: getIndexDecrease(compass.index, deletionIndex, reduced.deletedCount),
        ...(compass.type === 'reference'
          ? {
              reference: getIndexDecrease(compass.reference, deletionIndex, reduced.deletedCount),
            }
          : {}),
      };

      return {
        deletedCount: reduced.deletedCount,
        editIndex: getIndexDecrease(tab.editIndex, deletionIndex, reduced.deletedCount),
        nextCompasses: [...reduced.nextCompasses, nextCompass],
      };
    },
    { deletedCount: 0, editIndex: tab.editIndex, nextCompasses: [] },
  );

  return {
    ...tab,
    compasses: nextCompasses,
    editIndex,
  };
};

export const resetEditIndex = (tab: Tab): Tab => {
  return { ...tab, editIndex: editIndexDefault };
};

export const setEditIndex = (tab: Tab, compass: Compass): Tab => {
  return { ...tab, editIndex: compass.type === 'compass' ? compass.index : compass.reference };
};

export const updateCompass = (
  tab: Tab,
  compassIndex: number,
  frameIndex: number,
  stringIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    compasses: tab.compasses.map((compass, cIndex) => {
      return compass.type === 'reference' || arrayIndexToCompassIndex(cIndex) !== compassIndex
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

export const updateTitle = (tab: Tab, title: string): Tab => {
  return {
    ...tab,
    title,
  };
};
