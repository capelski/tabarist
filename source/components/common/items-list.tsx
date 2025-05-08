import React from 'react';
import { ListState } from '../../state';
import { PagedQueryCursor } from '../../types';

export type DefaultParams = { cursor?: PagedQueryCursor };

export type ItemsListProps<TData, TParams extends DefaultParams> = {
  itemRenderer: (item: TData) => React.ReactNode;
  listState: ListState<TData, TParams>;
  loadPage: (nextParams: ListState<TData, TParams>['params']) => void;
  noDocuments: React.ReactNode;
};

export const ItemsList: React.FC<ItemsListProps<any, DefaultParams>> = (props) => {
  return (
    <div className="items-list">
      <p style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          className="btn btn-outline-secondary"
          disabled={!props.listState.data?.previousFields}
          onClick={() => {
            const nextParams: ListState<any, DefaultParams>['params'] = {
              ...props.listState.params,
              cursor: {
                direction: 'desc',
                fields: props.listState.data!.previousFields!,
              },
            };

            props.loadPage(nextParams);
          }}
          type="button"
        >
          ⏪️
        </button>
        <button
          className="btn btn-outline-secondary"
          disabled={!props.listState.data?.nextFields}
          onClick={() => {
            const nextParams: ListState<any, DefaultParams>['params'] = {
              ...props.listState.params,
              cursor: {
                direction: 'asc',
                fields: props.listState.data!.nextFields!,
              },
            };

            props.loadPage(nextParams);
          }}
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
