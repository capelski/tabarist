import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PagedQueryCursor, PagedResponse } from '../types';
import { fetchPagedData } from './paged-queries';

type SampleDocument = { id: number };
const getCursorFields = (document: SampleDocument) => [String(document.id)];

let documents: SampleDocument[];
let documentsRequested: number;
let pageSize: number = 0;
let cursor: PagedQueryCursor | undefined;
let fetcher: (pageSize: number) => Promise<SampleDocument[]>;
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
      fields: [String(index)],
    };
  },
);

When('running the query', async () => {
  fetcher = (_pageSize) => {
    documentsRequested = _pageSize;

    const sortedDocuments = cursor?.direction === 'desc' ? documents.reverse() : documents;

    const startPosition = cursor
      ? sortedDocuments.findIndex((d) => String(d.id) === cursor!.fields[0])
      : 0;

    return Promise.resolve(sortedDocuments.slice(startPosition, startPosition + _pageSize));
  };
  result = await fetchPagedData(pageSize, cursor?.direction, fetcher, getCursorFields);
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
    const target = direction === 'next' ? result.nextFields : result.previousFields;
    expect(target?.[0]).to.equal(String(documentId));
  },
);

Then(/the response doesn't have a (next|previous) cursor/, (direction: 'next' | 'previous') => {
  const target = direction === 'next' ? result.nextFields : result.previousFields;
  expect(target).to.equal(undefined);
});
