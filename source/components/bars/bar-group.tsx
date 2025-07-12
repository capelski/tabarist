import React, { RefObject } from 'react';
import { AddMode } from '../../constants';
import { ActiveSlot, BarContainer, PositionOperation, Tab } from '../../types';
import { AddBar } from './add-bar';
import { BarContainerComponent } from './bar-container';
import { BarDestination } from './bar-destination';

export type BarGroupProps = {
  activeSlot: ActiveSlot | undefined;
  barContainers: BarContainer[];
  barsNumber: number;
  isEditMode: boolean | undefined;
  positionOperation: PositionOperation | undefined;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarGroup: React.FC<BarGroupProps> = (props) => {
  return (
    <div className="bars" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {props.isEditMode && (
        <div
          style={{
            alignItems: 'center',
            borderLeft: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            padding: '0 4px',
          }}
        >
          <AddBar
            addMode={AddMode.singleWithSection}
            barIndex={0}
            disabled={!!props.positionOperation}
            parentSection={undefined}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        </div>
      )}

      {props.barContainers.map((barContainer) => {
        return (
          <BarContainerComponent
            {...props}
            container={barContainer}
            key={barContainer.displayIndex}
          />
        );
      })}

      {props.isEditMode &&
        props.positionOperation &&
        props.positionOperation.sectionIndex === undefined &&
        props.positionOperation.startIndex !== props.barsNumber - 1 && (
          <div style={{ alignItems: 'center', display: 'flex', marginLeft: 8 }}>
            <BarDestination barIndex={props.barsNumber} parentSection={undefined} />
          </div>
        )}

      {/* Prevent last line from overstretching the bars */}
      <div style={{ height: 1, flexGrow: 1000000 }}></div>
    </div>
  );
};
