import { QueryParameters, RouteNames } from '../constants';
import { StarredListParameters, TabListParameters } from '../types';

export const getStarredListRelativeUrl = (params: StarredListParameters) => {
  const cursorParams = params.cursor
    ? `${QueryParameters.cursorDirection}=${params.cursor.direction}&` +
      params.cursor.fields.map((field) => `${QueryParameters.cursorFields}[]=${field}`).join('&')
    : '';

  return `${RouteNames.starredTabs}${cursorParams ? `?${cursorParams}` : ''}`;
};

export const getTabListRelativeUrl = (
  tabListRoute: RouteNames.home | RouteNames.myTabs,
  params: TabListParameters,
) => {
  const titleParam = params.titleFilter ? `${QueryParameters.title}=${params.titleFilter}&` : '';
  const cursorParams = params.cursor
    ? `${QueryParameters.cursorDirection}=${params.cursor.direction}&` +
      params.cursor.fields.map((field) => `${QueryParameters.cursorFields}[]=${field}`).join('&')
    : '';

  const hasParams = titleParam || cursorParams;
  return `${tabListRoute}${hasParams ? '?' : ''}${titleParam}${cursorParams}`;
};

export const getTabRelativeUrl = (tabId: string, editMode = false) => {
  return `${RouteNames.tabDetails.replace(':tabId', tabId)}${
    editMode ? `?${QueryParameters.editMode}=true` : ''
  }`;
};
