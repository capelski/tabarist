import { QueryParameters, RouteNames } from '../constants';
import { StarredListParameters, TabListParameters } from '../types';

export const getStarredListRelativeUrl = (params: StarredListParameters) => {
  const cursorParams = params.cursor
    ? `${QueryParameters.cursorDirection}=${params.cursor.direction}&` +
      params.cursor.values.map((field) => `${QueryParameters.cursorValues}[]=${field}`).join('&')
    : '';

  return `${RouteNames.starredTabs}${cursorParams ? `?${cursorParams}` : ''}`;
};

export const getTabListRelativeUrl = (
  tabListRoute: RouteNames.allTabs | RouteNames.myTabs,
  params: TabListParameters,
) => {
  const titleParam = params.titleFilter ? `${QueryParameters.title}=${params.titleFilter}&` : '';
  const cursorParams = params.cursor
    ? `${QueryParameters.cursorDirection}=${params.cursor.direction}&` +
      params.cursor.values.map((field) => `${QueryParameters.cursorValues}[]=${field}`).join('&')
    : '';

  const hasParams = titleParam || cursorParams;
  return `${tabListRoute}${hasParams ? '?' : ''}${titleParam}${cursorParams}`;
};

export const getTabRelativeUrl = (tabId: string, editMode = false) => {
  return `${RouteNames.tabDetails.replace(':tabId', tabId)}${
    editMode ? `?${QueryParameters.editMode}=true` : ''
  }`;
};
