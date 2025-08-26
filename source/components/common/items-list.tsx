import React from 'react';
import { ListState } from '../../state';
import { PagedQueryCursor } from '../../types';
import { ButtonLink } from './button-link';

export type DefaultParams = { cursor?: PagedQueryCursor<any> };

export type ItemsListProps<TData, TParams extends DefaultParams> = {
  getNavigationUrl: (params: ListState<TData, TParams>['params']) => string;
  itemRenderer: (item: TData) => React.ReactNode;
  listState: ListState<TData, TParams>;
  noDocuments: React.ReactNode;
};

export const ItemsList: React.FC<ItemsListProps<any, DefaultParams>> = (props) => {
  const previousParams: DefaultParams | undefined = props.listState.data?.previousCursor
    ? {
        ...props.listState.params,
        cursor: props.listState.data.previousCursor,
      }
    : undefined;

  const nextParams: DefaultParams | undefined = props.listState.data?.nextCursor
    ? {
        ...props.listState.params,
        cursor: props.listState.data.nextCursor,
      }
    : undefined;

  return (
    <div className="items-list">
      <p style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ButtonLink url={previousParams ? props.getNavigationUrl(previousParams) : undefined}>
          ⏪️
        </ButtonLink>
        <ButtonLink url={nextParams ? props.getNavigationUrl(nextParams) : undefined}>
          ⏩
        </ButtonLink>
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
