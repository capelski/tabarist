import React from 'react';
import { repeatsHeight } from '../constants';
import { tabOperations } from '../operations';
import { Bar } from '../types';
import { AddBar } from './add-bar';
import { addBar, CommonNonSectionBarProps, copyBarEnd, moveBarEnd } from './bar-commons';
import { BarControls } from './bar-controls';

export type BaseBarProps = CommonNonSectionBarProps<Bar> & {
  additionalControls?: React.ReactNode;
  canAddBar: boolean;
  coreComponent: React.ReactNode;
  displayBarControls: boolean;
};

export const BaseBarComponent: React.FC<BaseBarProps> = (props) => {
  const cancelPositionOperation = () => {
    const nextTab = tabOperations.cancelPositionOperation(props.tab);
    props.updateTab(nextTab);
  };

  const copyBarEndHandler = () => {
    copyBarEnd(props.tab, props.updateTab, props.bar.index, props.inSection);
  };

  const copyBarStart = () => {
    const nextTab = tabOperations.copyBarStart(props.tab, props.bar.index, props.inSection?.index);
    props.updateTab(nextTab);
  };

  const moveBarEndHandler = () => {
    moveBarEnd(props.tab, props.updateTab, props.bar.index, props.inSection);
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
    <div className="bar" style={{ display: 'flex', flexDirection: 'column', width: props.width }}>
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 8 }}>
        {props.isEditMode && props.canAddBar && (
          <AddBar
            addBar={(type) => {
              addBar(props.tab, props.updateTab, props.bar.index, type, props.inSection);
            }}
            barIndex={props.bar.index}
            copyBarEnd={copyBarEndHandler}
            copying={props.tab.copying}
            inSection={props.inSection}
            moveBarEnd={moveBarEndHandler}
            moving={props.tab.moving}
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
          cancelPositionOperation={cancelPositionOperation}
          copyBarStart={copyBarStart}
          copying={props.tab.copying}
          inSection={props.inSection}
          moveBarStart={moveBarStart}
          moving={props.tab.moving}
          removeBar={removeBar}
        >
          {props.additionalControls}
        </BarControls>
      )}
    </div>
  );
};
