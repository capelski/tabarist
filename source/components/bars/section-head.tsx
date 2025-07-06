import React, { RefObject } from 'react';
import { AddMode, ContainerType } from '../../constants';
import { ActiveSlot, BarContainer, PositionOperation, Tab } from '../../types';
import { AddBar } from './add-bar';
import { BarCore } from './bar-core';

export type SectionHeadProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  isEditMode: boolean | undefined;
  positionOperation: PositionOperation | undefined;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const SectionHead: React.FC<SectionHeadProps> = (props) => {
  if (!props.container.isParent) {
    return undefined;
  }

  return (
    props.container.display && (
      <BarCore {...props}>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          {props.container.type === ContainerType.sectionHead && (
            <div style={{ marginBottom: 8 }}>
              <AddBar
                addMode={AddMode.single}
                barIndex={0}
                parentSection={props.container.addToParent}
                tab={props.tab}
                updateTab={props.updateTab}
              />
            </div>
          )}
        </div>
      </BarCore>
    )
  );
};
