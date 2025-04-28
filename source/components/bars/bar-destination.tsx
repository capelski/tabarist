import React, { useContext } from 'react';
import { positionSymbol } from '../../constants';
import { ActionType, DispatchProvider } from '../../state';
import { PositionOperation, SectionBar, Tab } from '../../types';

export type BarDestinationProps = {
  barIndex: number;
  copying: PositionOperation | undefined;
  moving: PositionOperation | undefined;
  parentSection: SectionBar | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarDestination: React.FC<BarDestinationProps> = (props) => {
  const dispatch = useContext(DispatchProvider);

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
