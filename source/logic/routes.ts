import { RouteNames } from '../constants';

export const getTabRelativeUrl = (tabId: string) => {
  return RouteNames.tabDetails.replace(':tabId', tabId);
};
