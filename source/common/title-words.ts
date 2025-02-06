export const getTitleWords = (title: string): string[] => {
  return title
    .split(' ')
    .filter(Boolean)
    .map((word) => word.toLocaleLowerCase());
};
