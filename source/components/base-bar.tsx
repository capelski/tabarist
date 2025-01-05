import React from 'react';
import { BarType, repeatsHeight } from '../constants';
import { tabOperations } from '../operations';
import { Bar } from '../types';
import { AddBar } from './add-bar';
import { addBar, CommonNonSectionBarProps } from './bar-commons';
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
            inSection={props.inSection}
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
          removeBar={removeBar}
        >
          {props.additionalControls}
        </BarControls>
      )}
    </div>
  );
};
