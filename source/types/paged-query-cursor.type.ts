export type CursorDirection = 'asc' | 'desc';

/** Firestore doesn't support skipping documents. Use the fields of the first/last
 * document in the current page to retrieve the documents of the previous/following page
 */
export type PagedQueryCursor = {
  direction: CursorDirection;
  fields: string[];
};
