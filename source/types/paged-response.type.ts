import { PagedQueryCursor } from './paged-query-cursor.type';

export type PagedResponse<T> = {
  documents: T[];
  nextFields?: PagedQueryCursor['fields'];
  previousFields?: PagedQueryCursor['fields'];
};
