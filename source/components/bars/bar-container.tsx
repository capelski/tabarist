import React, { RefObject, useEffect, useRef } from 'react';
import { barControlsHeight, BarType, ContainerType } from '../../constants';
import { tabOperations } from '../../operations';
import { ActiveSlot, BarContainer, Tab } from '../../types';
import { BarControls } from './bar-controls';
import { BarComponentBaseProps } from './bar-handlers';
import { ChordBarComponent } from './chord-bar';
import { PickingBarComponent } from './picking-bar';
import { Repeats } from './repeats';

export type BarContainerComponentProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  isEditMode: boolean;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarContainerComponent: React.FC<BarContainerComponentProps> = (props) => {
  const divRef = useRef<HTMLDivElement>(null);

  const barBaseProps: BarComponentBaseProps = {
    activeSlot: props.activeSlot,
    backgroundColor: props.isEditMode ? props.container.backgroundColor : 'white',
    canUpdate: props.container.canUpdate,
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
        backgroundColor: barBaseProps.backgroundColor,
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
          <Repeats
            activeSlot={props.activeSlot}
            container={props.container}
            isEditMode={props.isEditMode}
            tab={props.tab}
            updateTab={props.updateTab}
          />

          {props.container.isParent ? (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
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
            </div>
          ) : props.container.renderedBar.type === BarType.chord ? (
            <ChordBarComponent
              {...barBaseProps}
              container={props.container as BarContainer<ContainerType.chord>}
              rhythms={props.tab.rhythms}
            />
          ) : (
            <PickingBarComponent
              {...barBaseProps}
              container={props.container as BarContainer<ContainerType.picking>}
            />
          )}
        </div>
      </div>

      {props.isEditMode && props.container.displayControls && (
        <div style={{ height: barControlsHeight }}>
          <BarControls container={props.container} tab={props.tab} updateTab={props.updateTab} />
        </div>
      )}
    </div>
  );
};
