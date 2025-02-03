import React from 'react';
import { repeatsHeight } from '../constants';
import { BarContainer, Section, Tab } from '../types';
import { AddBar } from './add-bar';
import { BarContainerComponent } from './bar-container';

export type BarGroupProps = {
  barContainers: BarContainer[];
  barsNumber: number;
  barWidth: string;
  isEditMode: boolean;
  inSection: Section | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarGroup: React.FC<BarGroupProps> = (props) => {
  return (
    <div className="bars" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {props.barContainers.map((barContainer) => {
        return (
          <BarContainerComponent {...props} container={barContainer} key={barContainer.position} />
        );
      })}

      {props.isEditMode && (
        <AddBar
          barIndex={props.barsNumber}
          expanded={true}
          inSection={props.inSection}
          style={{
            boxSizing: 'border-box',
            marginTop: props.inSection ? undefined : repeatsHeight,
            padding: '0 8px',
            width: props.barWidth,
          }}
          tab={props.tab}
          updateTab={props.updateTab}
        />
      )}
    </div>
  );
};
