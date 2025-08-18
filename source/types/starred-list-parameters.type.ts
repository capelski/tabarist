import { PagedQueryCursor } from './paged-query-cursor.type';
import { StarredTab } from './starred-tab.type';

export type StarredListParameters = {
  cursor?: PagedQueryCursor<StarredTab>;
};
