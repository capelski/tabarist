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

export type SectionTailProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  isEditMode: boolean | undefined;
  positionOperation: PositionOperation | undefined;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const SectionTail: React.FC<SectionTailProps> = (props) => {
  if (props.container.type !== ContainerType.sectionTail) {
    return undefined;
  }

  const { addToParent, appendBarIndex } = props.container as SectionTailContainer;

  const backgroundColor = props.container.isOperationTarget
    ? props.container.backgroundColor
    : undefined;

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
        {addToParent && props.container.isOperationTarget ? (
          <BarDestination barIndex={addToParent.bars.length} parentSection={addToParent} />
        ) : (
          <AddBar
            addMode={AddMode.singleWithSection}
            barIndex={appendBarIndex + 1}
            disabled={!!props.positionOperation}
            parentSection={undefined}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        )}
      </div>
    )
  );
};
