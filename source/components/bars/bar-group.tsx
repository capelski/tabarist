import React, { RefObject } from 'react';
import { ActiveSlot, BarContainer, Section, Tab } from '../../types';
import { AddBar } from './add-bar';
import { BarContainerComponent } from './bar-container';
import { BarDestination } from './bar-destination';
import { getPositionOperationConditions } from './bar-handlers';

export type BarGroupProps = {
  activeSlot: ActiveSlot | undefined;
  barContainers: BarContainer[];
  barsNumber: number;
  isEditMode: boolean;
  inSection: Section | undefined;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarGroup: React.FC<BarGroupProps> = (props) => {
  const { positionOperation, positionOperationApplicable, isValidPositionTarget } =
    getPositionOperationConditions(props.tab, props.barsNumber, props.inSection);

  return (
    <div className="bars" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {props.isEditMode && (
        <div style={{ alignItems: 'center', display: 'flex', marginRight: 8 }}>
          <AddBar
            barIndex={0}
            disabled={positionOperation}
            inSection={props.inSection}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        </div>
      )}

      {props.barContainers.map((barContainer) => {
        return (
          <BarContainerComponent {...props} container={barContainer} key={barContainer.position} />
        );
      })}

      {props.isEditMode && positionOperationApplicable && isValidPositionTarget && (
        <div style={{ alignItems: 'center', display: 'flex', marginLeft: 8 }}>
          <BarDestination
            barIndex={props.barsNumber}
            inSection={props.inSection}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        </div>
      )}

      {/* Prevent last line from overstretching the bars */}
      <div style={{ height: 1, flexGrow: 1000000 }}></div>
    </div>
  );
};
