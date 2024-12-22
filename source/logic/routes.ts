import { queryParameters, RouteNames } from '../constants';

export const getTabRelativeUrl = (tabId: string, editMode = false) => {
  return `${RouteNames.tabDetails.replace(':tabId', tabId)}${
    editMode ? `?${queryParameters.editMode}=true` : ''
  }`;
};
