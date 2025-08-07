import { RequestHandler } from 'express';
import { error } from 'firebase-functions/logger';
import { firestore, renderHtml } from '../common';
import {
  AppProps,
  DiminishedTab,
  fetchPagedData,
  PagedResponse,
  pageSize,
  parseTitle,
  QueryParameters,
  Tab,
  TabListParameters,
  tabOperations,
  tabsCollection,
} from '../ssr/ssr';

const getHomeTabs = async (params: TabListParameters): Promise<PagedResponse<Tab>> => {
  const fetcher = async (_pageSize: number) => {
    let query = firestore
      .collection(tabsCollection)
      .orderBy('title', params?.cursor?.direction)
      .orderBy('id', params?.cursor?.direction);

    if (params.titleFilter) {
      query = query.where('titleWords', 'array-contains', parseTitle(params.titleFilter));
    }
    if (params.cursor) {
      query = query.startAt(...params.cursor.fields);
    }

    const querySnapshot = await query.limit(_pageSize).get();
    return querySnapshot.docs.map((docSnapshot) =>
      tabOperations.augmentTab(docSnapshot.data() as DiminishedTab),
    );
  };

  const response = await fetchPagedData(
    pageSize,
    params?.cursor?.direction,
    fetcher,
    (document) => [document.title, document.id],
  );

  return response;
};

export const homeHandler: RequestHandler = async (req, res) => {
  const initialState: AppProps = {};

  try {
    const cursorDirection = req.query?.[QueryParameters.cursorDirection];
    const cursorFields = req.query?.[QueryParameters.cursorFields];
    const title = req.query?.[QueryParameters.title];

    const params: TabListParameters = {};

    if (
      cursorDirection &&
      (cursorDirection === 'asc' || cursorDirection === 'desc') &&
      cursorFields &&
      Array.isArray(cursorFields)
    ) {
      params.cursor = {
        direction: cursorDirection,
        fields: cursorFields.filter((f) => typeof f === 'string') as string[],
      };
    }

    if (title && typeof title === 'string') {
      params.titleFilter = title;
    }

    initialState.homeState = {
      data: await getHomeTabs(params),
      params,
    };
  } catch (e) {
    error('Error fetching the home tabs', e);
  }

  res.send(renderHtml(req.originalUrl, initialState));
};
