import { RequestHandler } from 'express';
import { error } from 'firebase-functions/logger';
import { renderHtml } from '../common';
import { serverDataFetcher, ServerWhereClause } from '../server-data-fetcher';
import {
  AppProps,
  DiminishedTab,
  PagedResponse,
  parseTitle,
  QueryParameters,
  Tab,
  TabListParameters,
  tabOperations,
  tabsCollection,
} from '../ssr/ssr';

const getHomeTabs = async (
  params?: TabListParameters,
): Promise<PagedResponse<DiminishedTab, Tab>> => {
  const where: ServerWhereClause<DiminishedTab>[] = params?.titleFilter
    ? [['titleWords', 'array-contains', parseTitle(params.titleFilter)]]
    : [];

  const page = await serverDataFetcher<DiminishedTab>([tabsCollection], ['title', 'id'], {
    cursor: params?.cursor,
    where,
  });

  return {
    ...page,
    documents: page.documents.map((document) => tabOperations.augmentTab(document)),
  };
};

export const homeHandler: RequestHandler = async (req, res) => {
  const initialState: AppProps = {};

  try {
    const cursorDirection = req.query?.[QueryParameters.cursorDirection];
    const cursorFields = req.query?.[QueryParameters.cursorValues];
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
        values: cursorFields.filter((f) => typeof f === 'string') as string[],
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
