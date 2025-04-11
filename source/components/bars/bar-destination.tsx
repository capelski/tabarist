import React from 'react';
import { positionSymbol } from '../../constants';
import { Section, Tab } from '../../types';
import { copyBarEnd, moveBarEnd } from './bar-handlers';

export type BarDestinationProps = {
  barIndex: number;
  inSection: Section | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarDestination: React.FC<BarDestinationProps> = (props) => {
  return (
    <button
      className="btn btn-sm btn-outline-primary"
      onClick={() => {
        if (props.tab.copying) {
          copyBarEnd(props.tab, props.updateTab, props.barIndex, props.inSection);
        } else if (props.tab.moving) {
          moveBarEnd(props.tab, props.updateTab, props.barIndex, props.inSection);
        }
      }}
    >
      {positionSymbol}
    </button>
  );
};
