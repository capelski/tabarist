import React, { RefObject, useEffect, useRef } from 'react';
import { barControlsHeight, BarType, referenceColor, sectionColor } from '../../constants';
import { ActiveSlot, BarContainer, ChordBar, PickingBar, Tab } from '../../types';
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
    backgroundColor: props.isEditMode
      ? props.container.inSectionBar
        ? sectionColor
        : props.container.isReference
        ? referenceColor
        : 'white'
      : 'white',
    canUpdate: !props.container.inSectionBar && !props.container.isReference,
    isEditMode: props.isEditMode,
    tab: props.tab,
    updateTab: props.updateTab,
  };

  const canChangeSection = !!props.container.inSectionBar && props.container.isFirstInSectionBar;
  const canRepeat = !props.container.inSectionBar || props.container.isFirstInSectionBar;
  const displayBarControls = !props.container.inSectionBar || props.container.isFirstInSectionBar;

  useEffect(() => {
    if (
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
          {!props.container.inSection && (
            <Repeats
              activeSlot={props.activeSlot}
              canChangeSection={canChangeSection}
              canRepeat={canRepeat}
              container={props.container}
              isEditMode={props.isEditMode}
              tab={props.tab}
              updateTab={props.updateTab}
            />
          )}

          {!props.container.renderedBar ? (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'center',
              }}
            >
              Empty section
            </div>
          ) : props.container.renderedBar.type === BarType.chord ? (
            <ChordBarComponent
              {...barBaseProps}
              container={props.container as BarContainer<ChordBar>}
              rhythms={props.tab.rhythms}
            />
          ) : (
            <PickingBarComponent
              {...barBaseProps}
              container={props.container as BarContainer<PickingBar>}
            />
          )}
        </div>
      </div>

      {props.isEditMode && (
        <div style={{ height: barControlsHeight }}>
          {displayBarControls && (
            <BarControls
              barIndex={props.container.originalBar.index}
              container={props.container}
              inSection={props.container.inSection}
              tab={props.tab}
              updateTab={props.updateTab}
            />
          )}
        </div>
      )}
    </div>
  );
};
