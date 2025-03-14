import React, { RefObject } from 'react';
import { barMinWidth } from '../../constants';
import { BarContainer, Section, Tab } from '../../types';
import { AddBar } from './add-bar';
import { BarContainerComponent } from './bar-container';

export type BarGroupProps = {
  barContainers: BarContainer[];
  barsNumber: number;
  isEditMode: boolean;
  inSection: Section | undefined;
  scrollView: RefObject<HTMLDivElement> | undefined;
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
            padding: '0 8px',
            width: barMinWidth,
          }}
          tab={props.tab}
          updateTab={props.updateTab}
        />
      )}

      {/* Prevent last line from overstretching the bars */}
      <div style={{ height: 1, flexGrow: 1000000 }}></div>
    </div>
  );
};
