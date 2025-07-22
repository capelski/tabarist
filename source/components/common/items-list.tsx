import React from 'react';
import { ListState } from '../../state';
import { PagedQueryCursor } from '../../types';

export type DefaultParams = { cursor?: PagedQueryCursor };

export type ItemsListProps<TData, TParams extends DefaultParams> = {
  getNavigationUrl: (nextParams: ListState<TData, TParams>['params']) => string;
  itemRenderer: (item: TData) => React.ReactNode;
  listState: ListState<TData, TParams>;
  loadPage: (nextParams: ListState<TData, TParams>['params']) => void;
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
        <button
          className="btn btn-outline-secondary"
          disabled={!previousParams}
          onClick={() => {
            if (previousParams) {
              props.loadPage(previousParams);
            }
          }}
          type="button"
        >
          <a
            href={previousParams ? props.getNavigationUrl(previousParams) : undefined}
            onClick={(event) => {
              event.preventDefault();
            }}
          >
            ⏪️
          </a>
        </button>
        <button
          className="btn btn-outline-secondary"
          disabled={!nextParams}
          onClick={() => {
            if (nextParams) {
              props.loadPage(nextParams);
            }
          }}
          type="button"
        >
          <a
            href={nextParams ? props.getNavigationUrl(nextParams) : undefined}
            onClick={(event) => {
              event.preventDefault();
            }}
          >
            ⏩
          </a>
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
