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

export const parseTitle = (title: string): string => {
  return title
    .replace(/[^\w\s]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .toLocaleLowerCase()
    .split(' ')
    .sort()
    .join(' ');
};
