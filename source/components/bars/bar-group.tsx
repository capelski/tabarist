import React, { RefObject } from 'react';
import { sectionColor } from '../../constants';
import { ActiveSlot, BarContainer, Tab } from '../../types';
import { AddBar } from './add-bar';
import { BarContainerComponent } from './bar-container';
import { BarDestination } from './bar-destination';
import { getPositionOperationConditions } from './bar-handlers';

export type BarGroupProps = {
  activeSlot: ActiveSlot | undefined;
  barContainers: BarContainer[];
  barsNumber: number;
  isEditMode: boolean;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarGroup: React.FC<BarGroupProps> = (props) => {
  const { positionOperation, positionOperationApplicable, isValidPositionTarget } =
    getPositionOperationConditions(props.tab, props.barsNumber, undefined);

  return (
    <div className="bars" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {props.isEditMode && (
        <div style={{ alignItems: 'center', display: 'flex', marginRight: 8 }}>
          <AddBar
            barIndex={0}
            disabled={positionOperation}
            parentSection={undefined}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        </div>
      )}

      {props.barContainers.map((barContainer) => {
        const barsNumber = barContainer.parentSection?.bars?.length ?? 0;
        const sectionConditions = barContainer.parentSection
          ? getPositionOperationConditions(props.tab, barsNumber, barContainer.parentSection)
          : undefined;

        return (
          <React.Fragment key={barContainer.displayIndex}>
            <BarContainerComponent {...props} container={barContainer} />
            {props.isEditMode &&
              barContainer.isLastInSectionBar &&
              sectionConditions?.positionOperationApplicable &&
              sectionConditions?.isValidPositionTarget && (
                <div
                  style={{
                    alignItems: 'center',
                    backgroundColor: sectionColor,
                    borderLeft: '1px solid black',
                    display: 'flex',
                  }}
                >
                  <BarDestination
                    barIndex={barsNumber}
                    parentSection={barContainer.parentSection}
                    tab={props.tab}
                    updateTab={props.updateTab}
                  />
                </div>
              )}
          </React.Fragment>
        );
      })}

      {props.isEditMode && positionOperationApplicable && isValidPositionTarget && (
        <div style={{ alignItems: 'center', display: 'flex', marginLeft: 8 }}>
          <BarDestination
            barIndex={props.barsNumber}
            parentSection={undefined}
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
