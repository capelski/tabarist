import React, { RefObject } from 'react';
import { AddMode, ContainerType } from '../../constants';
import { tabOperations } from '../../operations';
import { ActiveSlot, BarContainer, PositionOperation, Tab } from '../../types';
import { AddBar } from './add-bar';
import { BarCore } from './bar-core';

export type SectionHeadProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  copying: PositionOperation | undefined;
  isEditMode: boolean | undefined;
  moving: PositionOperation | undefined;
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
          <input
            disabled={props.container.type === ContainerType.sectionReference}
            onChange={(event) => {
              const nextTab = tabOperations.renameSection(
                props.tab,
                props.container.barIndex,
                event.target.value,
              );
              props.updateTab(nextTab);
            }}
            style={{ width: '100%' }}
            value={props.container.sectionName}
          />

          {props.container.type === ContainerType.section && (
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
