import { IndexedValue } from '../types';

export const createIndexedValuesArray = (
  itemsNumber: number,
  valueOrValueGetter: string | ((index: number) => string),
): IndexedValue[] =>
  Array.from({ length: itemsNumber }, (_, index) => ({
    index,
    value: typeof valueOrValueGetter === 'string' ? valueOrValueGetter : valueOrValueGetter(index),
  }));
