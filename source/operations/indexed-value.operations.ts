import { IndexedValue } from '../types';

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
