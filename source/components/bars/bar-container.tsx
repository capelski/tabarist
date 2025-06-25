import React, { RefObject, useEffect, useRef } from 'react';
import { AddMode, BarType, ContainerType } from '../../constants';
import { tabOperations } from '../../operations';
import { ActiveSlot, BarContainer, PositionOperation, Tab } from '../../types';
import { AddBar } from './add-bar';
import { BarComponentBaseProps } from './bar-handlers';
import { BarHeader } from './bar-header';
import { ChordBarComponent } from './chord-bar';
import { PickingBarComponent } from './picking-bar';

export type BarContainerComponentProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  copying: PositionOperation | undefined;
  isEditMode: boolean | undefined;
  moving: PositionOperation | undefined;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarContainerComponent: React.FC<BarContainerComponentProps> = (props) => {
  const divRef = useRef<HTMLDivElement>(null);

  const barBaseProps: BarComponentBaseProps = {
    activeSlot: props.activeSlot,
    isEditMode: props.isEditMode,
    tab: props.tab,
    updateTab: props.updateTab,
  };

  useEffect(() => {
    if (
      props.activeSlot &&
      props.activeSlot?.barContainer.position === props.container.position &&
      props.scrollView?.current &&
      divRef.current
    ) {
      props.scrollView.current.scrollTo({
        top: divRef.current.offsetTop - props.scrollView.current.clientHeight * 0.4,
        behavior: 'smooth',
      });
    }
  }, [props.activeSlot]);

  return (
    <div
      className="bar-container"
      ref={divRef}
      style={{
        alignSelf: 'stretch', // So chord bars next to picking bars have the same height
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        marginBottom: 8,
        width: props.container.width,
      }}
    >
      <div className="bar-content" style={{ display: 'flex', flexGrow: 1, flexDirection: 'row' }}>
        <div
          className="bar-core"
          style={{
            borderLeft: '1px solid black',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'end',
            padding: props.isEditMode ? '0 2px' : undefined,
          }}
        >
          <BarHeader {...props} />

          {props.container.isParent ? (
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
          ) : props.container.renderedBar.type === BarType.chord ? (
            <ChordBarComponent
              {...barBaseProps}
              container={props.container as BarContainer<ContainerType.chord>}
            />
          ) : (
            <PickingBarComponent
              {...barBaseProps}
              container={props.container as BarContainer<ContainerType.picking>}
            />
          )}
        </div>
      </div>
    </div>
  );
};
