import { AnchorDirection } from './anchor-direction.type';

export type TabListParameters = {
  /** Firestore doesn't support skipping documents. Use the title and id of the first/last
   * documents in the current page to retrieve the documents of the previous/following page.
   * We need both title and id, as there can be multiple tabs with the same title */
  anchorDocument?: {
    direction: AnchorDirection;
    id: string;
    title: string;
  };
  titleFilter?: string;
};
