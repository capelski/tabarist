import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { QuerySnapshot } from 'firebase/firestore';
import { PagedQueryCursor, PagedResponse } from '../types';
import {
  CollectionQueryResolver,
  getPagedDataFetcher,
  PagedDataFetcher,
} from './paged-data-fetcher';

type SampleDocument = { id: number };

let documents: SampleDocument[];
let documentsRequested: number;
let pageSize: number = 0;
let cursor: PagedQueryCursor<SampleDocument> | undefined;
let resolver: CollectionQueryResolver<QuerySnapshot>;
let fetcher: PagedDataFetcher<QuerySnapshot>;
let result: PagedResponse<SampleDocument>;

Given('a collection of {int} sample documents', (documentsCount: number) => {
  documents = Array.from({ length: documentsCount }, (_, index) => {
    return { id: index + 1 };
  });
});

Given('a paged query with size {int}', (_pageSize: number) => {
  pageSize = _pageSize;
});

Given(
  /a (next|previous) cursor at document (\d+)/,
  (direction: 'next' | 'previous', index: number) => {
    cursor = {
      direction: direction === 'next' ? 'asc' : 'desc',
      values: [String(index)],
    };
  },
);

When('running the query', async () => {
  resolver = (_collectionPath, orderBy, limit, options) => {
    documentsRequested = limit;

    const [[, direction]] = orderBy;
    const sortedDocuments = direction === 'desc' ? documents.reverse() : documents;

    const startPosition = options?.startAt?.length
      ? sortedDocuments.findIndex((d) => String(d.id) === options.startAt?.[0])
      : 0;

    const documentsWindow = sortedDocuments.slice(startPosition, startPosition + limit);

    return Promise.resolve({
      docs: documentsWindow.map((document) => ({ data: () => document })),
    } as unknown as QuerySnapshot);
  };
  fetcher = getPagedDataFetcher(resolver);
  result = await fetcher(['SampleDocument'], ['id'], { cursor, limit: pageSize });
});

Then('{int} documents are requested', (_documentsRequested: number) => {
  expect(_documentsRequested).to.equal(documentsRequested);
});

Then('the response contains {int} documents', (documents: number) => {
  expect(result.documents).to.have.length(documents);
});

Then('the document {int} has id {int}', (position: number, id: number) => {
  expect(result.documents[position - 1]?.id).to.equal(id);
});

Then(
  /the response has a (next|previous) cursor pointing at document (\d+)/,
  (direction: 'next' | 'previous', documentId: number) => {
    const target = direction === 'next' ? result.nextCursor : result.previousCursor;
    expect(target?.values[0]).to.equal(String(documentId));
  },
);

Then(/the response doesn't have a (next|previous) cursor/, (direction: 'next' | 'previous') => {
  const target = direction === 'next' ? result.nextCursor : result.previousCursor;
  expect(target).to.equal(undefined);
});
