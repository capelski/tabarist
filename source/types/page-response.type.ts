export type PageResponse<T> = {
  documents: T[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
