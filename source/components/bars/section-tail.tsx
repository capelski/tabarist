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
import { BarDestination } from './bar-destination';
import { getPositionOperationConditions } from './bar-handlers';

export type SectionTailProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  copying: PositionOperation | undefined;
  isEditMode: boolean | undefined;
  moving: PositionOperation | undefined;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const SectionTail: React.FC<SectionTailProps> = (props) => {
  if (props.container.type !== ContainerType.sectionTail) {
    return undefined;
  }

  const { addToParent, appendBarIndex } = props.container as SectionTailContainer;

  const sectionConditions = addToParent
    ? getPositionOperationConditions(
        props.copying,
        props.moving,
        addToParent.bars.length,
        addToParent,
      )
    : undefined;

  const isMovingTarget =
    sectionConditions?.positionOperationApplicable && sectionConditions?.isValidPositionTarget;

  const backgroundColor = isMovingTarget ? props.container.backgroundColor : undefined;

  return (
    props.container.display && (
      <div
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
};
