import React from 'react';
import { ListState } from '../../state';
import { PagedQueryCursor } from '../../types';

export type DefaultParams = { cursor?: PagedQueryCursor };

export type ItemsListProps<TData, TParams extends DefaultParams> = {
  getNavigationUrl: (nextParams: ListState<TData, TParams>['params']) => string;
  itemRenderer: (item: TData) => React.ReactNode;
  listState: ListState<TData, TParams>;
  noDocuments: React.ReactNode;
};

export const ItemsList: React.FC<ItemsListProps<any, DefaultParams>> = (props) => {
  const previousParams: DefaultParams | undefined = props.listState.data?.previousFields
    ? {
        ...props.listState.params,
        cursor: {
          direction: 'desc',
          fields: props.listState.data.previousFields,
        },
      }
    : undefined;

  const nextParams: DefaultParams | undefined = props.listState.data?.nextFields
    ? {
        ...props.listState.params,
        cursor: {
          direction: 'asc',
          fields: props.listState.data.nextFields,
        },
      }
    : undefined;

  return (
    <div className="items-list">
      <p style={{ display: 'flex', justifyContent: 'space-between' }}>
        <a href={previousParams ? props.getNavigationUrl(previousParams) : undefined}>
          <button className="btn btn-outline-secondary" disabled={!previousParams} type="button">
            ⏪️
          </button>
        </a>
        <a href={nextParams ? props.getNavigationUrl(nextParams) : undefined}>
          <button className="btn btn-outline-secondary" disabled={!nextParams} type="button">
            ⏩
          </button>
        </a>
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
