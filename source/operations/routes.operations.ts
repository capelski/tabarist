import { QueryParameters, RouteNames } from '../constants';
import { StarredListParameters, TabQueryParameters } from '../types';

export const getStarredListRelativeUrl = (params: StarredListParameters) => {
  const anchorParams = params.anchorDocument
    ? `${QueryParameters.anchorDirection}=${params.anchorDocument.direction}&` +
      `${QueryParameters.anchorId}=${params.anchorDocument.id}`
    : '';

  return `${RouteNames.starredTabs}${anchorParams ? `?${anchorParams}` : ''}`;
};

export const getTabListRelativeUrl = (
  tabListRoute: RouteNames.home | RouteNames.myTabs,
  params: TabQueryParameters,
) => {
  const titleParam = params.titleFilter ? `${QueryParameters.title}=${params.titleFilter}&` : '';
  const anchorParams = params.anchorDocument
    ? `${QueryParameters.anchorDirection}=${params.anchorDocument.direction}&` +
      `${QueryParameters.anchorId}=${params.anchorDocument.id}&` +
      `${QueryParameters.anchorTitle}=${params.anchorDocument.title}&`
    : '';

  const hasParams = titleParam || anchorParams;
  return `${tabListRoute}${hasParams ? '?' : ''}${titleParam}${anchorParams}`;
};

export const getTabRelativeUrl = (tabId: string, editMode = false) => {
  return `${RouteNames.tabDetails.replace(':tabId', tabId)}${
    editMode ? `?${QueryParameters.editMode}=true` : ''
  }`;
};
