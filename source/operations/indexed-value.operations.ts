import { IndexedValue } from '../types';

export const debugBarMovements = false;

export const createIndexedValuesArray = (
  itemsNumber: number,
  valueOrValueGetter: string | ((index: number) => string),
): IndexedValue[] =>
  Array.from({ length: itemsNumber }, (_, index) => ({
    index,
    value: typeof valueOrValueGetter === 'string' ? valueOrValueGetter : valueOrValueGetter(index),
  }));

export const getIndexDisplayValue = (index: number) => {
  return index + 1;
};

export const getIndexAfterMove = (barIndex: number, startIndex: number, endIndex: number) => {
  const isTargetBar = barIndex === startIndex;
  const needsIndexIncrease = barIndex < startIndex && barIndex >= endIndex;
  const needsIndexDecrease = barIndex > startIndex && barIndex <= endIndex;

  const nextIndex = isTargetBar
    ? endIndex
    : needsIndexIncrease
    ? barIndex + 1
    : needsIndexDecrease
    ? barIndex - 1
    : barIndex;

  debugBarMovements && console.log('Bar', barIndex, 'becomes', nextIndex);

  return nextIndex;
};

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
