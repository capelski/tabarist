import React, { RefObject } from 'react';
import { AddMode, ContainerType } from '../../constants';
import {
  ActiveSlot,
  BarContainer,
  PositionOperation,
  SectionTailContainer,
  Tab,
} from '../../types';
import { AddBar } from './add-bar';
import { BarContainerComponent } from './bar-container';
import { BarDestination } from './bar-destination';
import { getPositionOperationConditions } from './bar-handlers';

export type BarGroupProps = {
  activeSlot: ActiveSlot | undefined;
  barContainers: BarContainer[];
  barsNumber: number;
  copying: PositionOperation | undefined;
  isEditMode: boolean | undefined;
  moving: PositionOperation | undefined;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarGroup: React.FC<BarGroupProps> = (props) => {
  const { positionOperation, positionOperationApplicable, isValidPositionTarget } =
    getPositionOperationConditions(props.copying, props.moving, props.barsNumber, undefined);

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
            disabled={positionOperation}
            parentSection={undefined}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        </div>
      )}

      {props.barContainers.map((barContainer) => {
        if (barContainer.type !== ContainerType.sectionTail) {
          return (
            barContainer.display && (
              <BarContainerComponent
                {...props}
                container={barContainer}
                key={barContainer.displayIndex}
              />
            )
          );
        }

        const { addToParent, appendBarIndex } = barContainer as SectionTailContainer;

        const sectionConditions = addToParent
          ? getPositionOperationConditions(
              props.copying,
              props.moving,
              addToParent.bars.length,
              addToParent,
            )
          : undefined;

        const isMovingTarget =
          sectionConditions?.positionOperationApplicable &&
          sectionConditions?.isValidPositionTarget;

        const backgroundColor = isMovingTarget ? barContainer.backgroundColor : undefined;

        return (
          barContainer.display && (
            <div
              key={barContainer.displayIndex}
              style={{
                alignItems: 'center',
                backgroundColor: backgroundColor,
                borderLeft: '1px solid black',
                display: 'flex',
                justifyContent: 'center',
                padding: '0 4px',
              }}
            >
              {addToParent && isMovingTarget ? (
                <BarDestination
                  barIndex={addToParent.bars.length}
                  copying={props.copying}
                  moving={props.moving}
                  parentSection={addToParent}
                  tab={props.tab}
                  updateTab={props.updateTab}
                />
              ) : (
                <AddBar
                  addMode={AddMode.singleWithSection}
                  barIndex={appendBarIndex + 1}
                  disabled={!!props.copying || !!props.moving}
                  parentSection={undefined}
                  tab={props.tab}
                  updateTab={props.updateTab}
                />
              )}
            </div>
          )
        );
      })}

      {props.isEditMode && positionOperationApplicable && isValidPositionTarget && (
        <div style={{ alignItems: 'center', display: 'flex', marginLeft: 8 }}>
          <BarDestination
            barIndex={props.barsNumber}
            copying={props.copying}
            moving={props.moving}
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
