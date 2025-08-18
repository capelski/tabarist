import {
  OrderByDirection as OrderByDirection_S,
  QuerySnapshot as QuerySnapshot_S,
  WhereFilterOp as WhereFilterOp_S,
} from 'firebase-admin/firestore';
import {
  OrderByDirection as OrderByDirection_C,
  QuerySnapshot as QuerySnapshot_C,
  WhereFilterOp as WhereFilterOp_C,
} from 'firebase/firestore';
import { defaultPageSize } from '../constants';
import { PagedQueryCursor, PagedResponse } from '../types';

type CollectionOrderByClause<T extends QuerySnapshot_C | QuerySnapshot_S, TField = string> = [
  fieldPath: TField,
  direction?: T extends QuerySnapshot_C ? OrderByDirection_C : OrderByDirection_S,
];

export type CollectionWhereClause<T extends QuerySnapshot_C | QuerySnapshot_S, TField = string> = [
  fieldPath: TField,
  operator: T extends QuerySnapshot_C ? WhereFilterOp_C : WhereFilterOp_S,
  value: unknown,
];

export type CollectionQueryResolver<
  T extends QuerySnapshot_C | QuerySnapshot_S,
  TField = string,
> = (
  collectionPath: string[],
  orderBy: CollectionOrderByClause<T, TField>[],
  limit: number,
  options?: {
    startAt?: string[];
    where?: CollectionWhereClause<T, TField>[];
  },
) => Promise<T>;

type PagedDataFetcherArguments<TQuery extends QuerySnapshot_C | QuerySnapshot_S, TData> = [
  collectionPath: string[],
  cursorFields: (keyof TData)[],
  options?: {
    cursor?: PagedQueryCursor<TData>;
    limit?: number;
    where?: CollectionWhereClause<TQuery, keyof TData>[];
  },
];

export type PagedDataFetcher<TQuery extends QuerySnapshot_C | QuerySnapshot_S> = <TData>(
  ...args: PagedDataFetcherArguments<TQuery, TData>
) => Promise<PagedResponse<TData>>;

export const getPagedDataFetcher = <TQuery extends QuerySnapshot_C | QuerySnapshot_S>(
  resolver: CollectionQueryResolver<TQuery>,
): PagedDataFetcher<TQuery> => {
  return async function pagedDataFetcher<TData>(
    ...[
      collectionPath,
      cursorFields,
      { cursor, limit = defaultPageSize, where } = {},
    ]: PagedDataFetcherArguments<TQuery, TData>
  ): Promise<PagedResponse<TData>> {
    const cursorOffset = cursor ? 1 : 0;
    const requestedLimit = limit + 1 + cursorOffset;

    const snapshot = await resolver(
      collectionPath,
      cursorFields.map((fieldName) => [fieldName as string, cursor?.direction]),
      requestedLimit,
      {
        startAt: cursor?.values,
        where: where as CollectionWhereClause<TQuery>[],
      },
    );
    const response = snapshot.docs.map((doc) => doc.data() as TData);
    const documentsWindow = response.slice(cursorOffset, limit + cursorOffset);
    const documents = cursor?.direction === 'desc' ? documentsWindow.reverse() : documentsWindow;

    const documentToCursorValues = (document: TData) => {
      return cursorFields.map((field) => String(document[field]));
    };

    const nextCursorValues =
      cursor?.direction === undefined || cursor?.direction === 'asc'
        ? response[requestedLimit - 1]
          ? documentToCursorValues(response[requestedLimit - 2])
          : undefined
        : documentToCursorValues(documents[documents.length - 1]);

    const previousCursorValues = // If no cursor, we are loading the first page; previous must be disabled
      cursor === undefined
        ? undefined
        : cursor.direction === 'asc'
        ? documentToCursorValues(documents[0])
        : response[requestedLimit - 1]
        ? documentToCursorValues(response[requestedLimit - 2])
        : undefined;

    return {
      documents,
      nextCursor: nextCursorValues ? { direction: 'asc', values: nextCursorValues } : undefined,
      previousCursor: previousCursorValues
        ? { direction: 'desc', values: previousCursorValues }
        : undefined,
    };
  };
};
