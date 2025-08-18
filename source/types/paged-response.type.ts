import { PagedQueryCursor } from './paged-query-cursor.type';

export type PagedResponse<TSource, TDocument = TSource> = {
  documents: TDocument[];
  nextCursor?: PagedQueryCursor<TSource>;
  previousCursor?: PagedQueryCursor<TSource>;
};
