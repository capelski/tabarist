import { AnchorDirection } from './anchor-direction.type';

export type StarredListParameters = {
  /** Firestore doesn't support skipping documents. Use the id of the first/last
   * documents in the current page to retrieve the documents of the previous/following page  */
  anchorDocument?: {
    direction: AnchorDirection;
    id: string;
  };
};
