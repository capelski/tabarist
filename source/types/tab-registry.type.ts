export type TabRegistry = {
  [id: string]: {
    hasUnsyncedChange: boolean;
    synced: boolean;
    title: string;
  };
};
