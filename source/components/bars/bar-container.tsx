import React, { RefObject, useEffect, useRef } from 'react';
import {
  barControlsHeight,
  BarType,
  referenceColor,
  referredSectionColor,
  sectionColor,
} from '../../constants';
import { tabOperations } from '../../operations';
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
      ? props.container.isReference
        ? props.container.parentSection || props.container.originalBar.type === BarType.section
          ? referredSectionColor
          : referenceColor
        : props.container.parentSection
        ? sectionColor
        : 'white'
      : 'white',
    canUpdate: !props.container.isReference,
    isEditMode: props.isEditMode,
    tab: props.tab,
    updateTab: props.updateTab,
  };

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
    (props.isEditMode || props.container.renderedBar) && (
      <div
        className="bar-container"
        ref={divRef}
        style={{
          backgroundColor: props.container.renderedBar
            ? barBaseProps.backgroundColor
            : props.container.isReference
            ? props.container.parentSection || props.container.originalBar.type === BarType.section
              ? referredSectionColor
              : referenceColor
            : sectionColor,
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

            {props.container.originalBar.type === BarType.section && (
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  flexGrow: 1,
                  justifyContent: 'center',
                }}
              >
                <input
                  disabled={props.container.isReference}
                  onChange={(event) => {
                    const nextTab = tabOperations.renameSection(
                      props.tab,
                      props.container.originalIndex,
                      event.target.value,
                    );
                    props.updateTab(nextTab);
                  }}
                  style={{ width: '100%' }}
                  value={props.container.originalBar.name}
                />
              </div>
            )}

            {props.container.renderedBar &&
              (props.container.renderedBar.type === BarType.chord ? (
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
              ))}
          </div>
        </div>

        {props.isEditMode &&
          (!props.container.parentSection || !props.container.parentIsReference) && (
            <div style={{ height: barControlsHeight }}>
              <BarControls
                barIndex={props.container.originalIndex}
                container={props.container}
                parentSection={props.container.parentSection}
                tab={props.tab}
                updateTab={props.updateTab}
              />
            </div>
          )}
      </div>
    )
  );
};
