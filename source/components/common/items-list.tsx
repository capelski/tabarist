import React from 'react';
import { ListState } from '../../state';

export type ItemsListProps<T> = {
  itemRenderer: (item: T) => React.ReactNode;
  listState: ListState<T, any>;
  loadNext: () => void;
  loadPrevious: () => void;
  noDocuments: React.ReactNode;
};

export const ItemsList: React.FC<ItemsListProps<any>> = (props) => {
  return (
    <div className="items-list">
      <p style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          className="btn btn-outline-secondary"
          disabled={!props.listState.data?.hasPreviousPage}
          onClick={props.loadPrevious}
          type="button"
        >
          ⏪️
        </button>
        <button
          className="btn btn-outline-secondary"
          disabled={!props.listState.data?.hasNextPage}
          onClick={props.loadNext}
          type="button"
        >
          ⏩
        </button>
      </p>

      {!props.listState.data?.documents ? (
        <p>Loading...</p>
      ) : props.listState.data.documents.length === 0 ? (
        props.noDocuments
      ) : (
        <div>
          {props.listState.data.documents.map((item) => {
            return props.itemRenderer(item);
          })}
        </div>
      )}
    </div>
  );
};
