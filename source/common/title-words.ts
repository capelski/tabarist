import { QuerySnapshot as QuerySnapshot_S } from 'firebase-admin/firestore';
import { QuerySnapshot as QuerySnapshot_C } from 'firebase/firestore';
import { DiminishedTab } from '../types';
import { CollectionWhereClause } from './paged-data-fetcher';

const getAllCombinations = (words: string[]): string[] => {
  const combinations: string[] = [];

  const generateCombinations = (current: string[], remaining: string[]) => {
    if (current.length > 0) {
      combinations.push(current.join(' '));
    }

    for (let i = 0; i < remaining.length; i++) {
      generateCombinations([...current, remaining[i]], remaining.slice(i + 1));
    }
  };

  generateCombinations([], words);

  return combinations;
};

export const getTitleWords = (title: string): string[] => {
  const words = parseTitle(title).split(' ');

  const allCombinations = getAllCombinations(words);

  return allCombinations;
};

export const getTitleWordsClause = <T extends QuerySnapshot_C | QuerySnapshot_S>(
  title: string,
): CollectionWhereClause<T, keyof DiminishedTab> => [
  'titleWords',
  'array-contains',
  parseTitle(title),
];

const parseTitle = (title: string): string => {
  return title
    .replace(/[^\w\s]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .toLocaleLowerCase()
    .split(' ')
    .sort()
    .join(' ');
};
