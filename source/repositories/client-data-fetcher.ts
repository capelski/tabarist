import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAt,
  where,
} from 'firebase/firestore';
import { CollectionQueryResolver, CollectionWhereClause, getPagedDataFetcher } from '../common';
import { getFirebaseContext } from '../firebase-context';

export type ClientWhereClause<TField> = CollectionWhereClause<QuerySnapshot, keyof TField>;

const clientResolver: CollectionQueryResolver<QuerySnapshot> = (
  [collectionName, ...collectionPath],
  orderByClauses,
  limitValue,
  { startAt: startAtValues, where: whereClauses = [] } = {},
) => {
  const queryData = query(
    collection(getFirebaseContext().firestore, collectionName, ...collectionPath),
    ...orderByClauses.map(([fieldPath, direction]) => orderBy(fieldPath, direction)),
    ...whereClauses.map(([fieldPath, operator, value]) => where(fieldPath, operator, value)),
    ...(startAtValues ? [startAt(...startAtValues)] : []),
    limit(limitValue),
  );

  return getDocs(queryData);
};

export const clientDataFetcher = getPagedDataFetcher(clientResolver);
