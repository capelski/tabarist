import React, { useContext } from 'react';
import { positionSymbol } from '../../constants';
import { ActionType, StateProvider } from '../../state';
import { SectionBar } from '../../types';

export type BarDestinationProps = {
  barIndex: number;
  parentSection: SectionBar | undefined;
};

export const BarDestination: React.FC<BarDestinationProps> = (props) => {
  const { dispatch } = useContext(StateProvider);

  return (
    <button
      className="btn btn-sm btn-outline-primary"
      onClick={() => {
        dispatch({
          type: ActionType.positionOperationEnd,
          endIndex: props.barIndex,
          parentSection: props.parentSection,
        });
      }}
    >
      {positionSymbol}
    </button>
  );
};
