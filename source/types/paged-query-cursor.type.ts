export type CursorDirection = 'asc' | 'desc';

/** Firestore doesn't support skipping documents. Use the values of the orderBy
 * fields from the first/last document in the current page to retrieve the documents
 * of the previous/following page
 */
export type PagedQueryCursor<_T> = {
  direction: CursorDirection;
  values: string[];
};
