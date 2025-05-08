import { CursorDirection, PagedResponse } from '../types';

export const fetchPagedData = async <T>(
  pageSize: number,
  direction: CursorDirection | undefined,
  fetcher: (pageSize: number) => Promise<T[]>,
  getCursorFields: (document: T) => string[],
): Promise<PagedResponse<T>> => {
  const cursorOffset = direction ? 1 : 0;
  const requestedPageSize = pageSize + 1 + cursorOffset;

  const response = await fetcher(requestedPageSize);
  const documentsWindow = response.slice(cursorOffset, pageSize + cursorOffset);
  const documents = direction === 'desc' ? documentsWindow.reverse() : documentsWindow;

  return {
    documents,
    nextFields:
      direction === undefined || direction === 'asc'
        ? response[requestedPageSize - 1]
          ? getCursorFields(response[requestedPageSize - 2])
          : undefined
        : getCursorFields(documents[documents.length - 1]),
    previousFields:
      // If no direction, we are loading the first page; previous must be disabled
      direction === undefined
        ? undefined
        : direction === 'asc'
        ? getCursorFields(documents[0])
        : response[requestedPageSize - 1]
        ? getCursorFields(response[requestedPageSize - 2])
        : undefined,
  };
};
