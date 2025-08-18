import { DiminishedTab } from './diminished-tab.type';
import { PagedQueryCursor } from './paged-query-cursor.type';

export type TabListParameters = {
  cursor?: PagedQueryCursor<DiminishedTab>;
  titleFilter?: string;
};
