import React from 'react';
import { BarType, repeatsHeight } from '../constants';
import { tabOperations } from '../operations';
import { Bar } from '../types';
import { AddBar } from './add-bar';
import { addBar, CommonNonSectionBarProps, moveBarEnd } from './bar-commons';
import { BarControls } from './bar-controls';

export type BaseBarProps = CommonNonSectionBarProps<Bar> & {
  additionalControls?: React.ReactNode;
  canAddBar: boolean;
  coreComponent: React.ReactNode;
  displayBarControls: boolean;
};

export const BaseBarComponent: React.FC<BaseBarProps> = (props) => {
  const addBarHandler = (type: BarType) => {
    addBar(props.tab, props.updateTab, props.bar.index, type, props.inSection);
  };

  const moveBarEndHandler = () => {
    moveBarEnd(props.tab, props.updateTab, props.bar.index, props.inSection);
  };

  const moveBarCancel = () => {
    const nextTab = tabOperations.moveBarCancel(props.tab);
    props.updateTab(nextTab);
  };

  const moveBarStart = () => {
    const nextTab = tabOperations.moveBarStart(props.tab, props.bar.index, props.inSection?.index);
    props.updateTab(nextTab);
  };

  const removeBar = () => {
    const nextTab = tabOperations.removeBar(props.tab, props.bar.index, props.inSection);
    props.updateTab(nextTab);
  };

  return (
    <div
      className="bar"
      style={{ display: 'flex', flexDirection: 'column', width: `${props.width}%` }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, marginBottom: 8 }}>
        {props.isEditMode && props.canAddBar && (
          <AddBar
            addBar={addBarHandler}
            barIndex={props.bar.index}
            inSection={props.inSection}
            moveBarEnd={moveBarEndHandler}
            movement={props.tab.movement}
            style={{
              marginTop: props.inSection ? undefined : repeatsHeight,
            }}
          />
        )}

        {props.coreComponent}
      </div>

      {props.isEditMode && props.displayBarControls && (
        <BarControls
          bar={props.bar}
          copyBar={() => {
            addBarHandler(BarType.reference);
          }}
          inSection={props.inSection}
          moveBarCancel={moveBarCancel}
          moveBarStart={moveBarStart}
          movement={props.tab.movement}
          removeBar={removeBar}
        >
          {props.additionalControls}
        </BarControls>
      )}
    </div>
  );
};
