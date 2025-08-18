import { QuerySnapshot } from 'firebase-admin/firestore';
import { firestore } from './common';
import { CollectionQueryResolver, CollectionWhereClause, getPagedDataFetcher } from './ssr/ssr';

export type ServerWhereClause = CollectionWhereClause<QuerySnapshot>;

export const serverResolver: CollectionQueryResolver<QuerySnapshot> = (
  collectionPath,
  orderBy,
  limit,
  { startAt, where = [] } = {},
) => {
  let query: FirebaseFirestore.Query = firestore.collection(collectionPath.join('/'));

  for (const [fieldPath, direction] of orderBy) {
    query = query.orderBy(fieldPath, direction);
  }

  for (const [fieldPath, operator, value] of where) {
    query = query.where(fieldPath, operator, value);
  }

  if (startAt) {
    query = query.startAt(...startAt);
  }

  return query.limit(limit).get();
};

export const serverDataFetcher = getPagedDataFetcher(serverResolver);
