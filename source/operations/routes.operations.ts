import { QueryParameters, RouteNames } from '../constants';

export const getTabRelativeUrl = (tabId: string, editMode = false) => {
  return `${RouteNames.tabDetails.replace(':tabId', tabId)}${
    editMode ? `?${QueryParameters.editMode}=true` : ''
  }`;
};
