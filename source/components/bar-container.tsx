import React from 'react';
import { BarType, referenceColor, repeatsHeight, sectionColor, stringHeight } from '../constants';
import { BarContainer, ChordBar, PickingBar, Tab } from '../types';
import { AddBar } from './add-bar';
import { BarComponentBaseProps } from './bar-commons';
import { BarControls } from './bar-controls';
import { ChordBarComponent } from './chord-bar';
import { PickingBarComponent } from './picking-bar';
import { Repeats } from './repeats';

export type BarContainerComponentProps = {
  barWidth: string;
  container: BarContainer;
  isEditMode: boolean;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarContainerComponent: React.FC<BarContainerComponentProps> = (props) => {
  const barBaseProps: BarComponentBaseProps = {
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
  const canAddBar = !props.container.inSectionBar || props.container.isFirstInSectionBar;
  const canChangeSection = !!props.container.inSectionBar && props.container.isFirstInSectionBar;
  const canRebase = !props.container.inSectionBar && !props.container.isReference;
  const canRepeat = !props.container.inSectionBar || props.container.isFirstInSectionBar;
  const displayBarControls = !props.container.inSectionBar || props.container.isFirstInSectionBar;

  return (
    <div
      className="bar"
      style={{ display: 'flex', flexDirection: 'column', width: props.barWidth }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 8 }}>
        {props.isEditMode && canAddBar && (
          <AddBar
            barIndex={props.container.originalBar.index}
            inSection={props.container.inSection}
            style={{
              marginTop: props.container.inSection ? undefined : repeatsHeight,
            }}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {!props.container.inSection && (
            <Repeats
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
                justifyContent: 'center',
                height: stringHeight * 6,
              }}
            >
              Empty section
            </div>
          ) : props.container.renderedBar.type === BarType.chord ? (
            <ChordBarComponent
              {...barBaseProps}
              container={props.container as BarContainer<ChordBar>}
              strummingPatterns={props.tab.strummingPatterns}
            />
          ) : (
            <PickingBarComponent
              {...barBaseProps}
              container={props.container as BarContainer<PickingBar>}
            />
          )}
        </div>
      </div>

      {props.isEditMode && displayBarControls && (
        <BarControls
          canRebase={canRebase}
          container={props.container}
          inSection={props.container.inSection}
          tab={props.tab}
          updateTab={props.updateTab}
        />
      )}
    </div>
  );
};
