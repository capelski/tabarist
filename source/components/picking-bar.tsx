import React from 'react';
import { PickingBar, Section } from '../types';
import { AddBarPropsHandlers } from './add-bar';
import { BarControlsHandlers } from './bar-controls';
import { BaseBarComponent } from './base-bar';
import { getPickingBarCore } from './picking-bar-core';

export type PickingBarProps = AddBarPropsHandlers &
  BarControlsHandlers & {
    bar: PickingBar;
    isEditMode: boolean;
    inSection?: Section;
    rebase?: (framesNumber: number) => void;
    updateFrame?: (frameIndex: number, stringIndex: number, value: string) => void;
    width: number;
  };

export const PickingBarComponent: React.FC<PickingBarProps> = (props) => {
  const { additionalControls, coreComponent } = getPickingBarCore({
    ...props,
    backgroundColor: 'white',
    borderLeft: '1px solid black',
    displayPickingRebase: props.isEditMode,
  });

  return (
    <BaseBarComponent
      {...props}
      additionalControls={additionalControls}
      allowInsertSection={!props.inSection}
      canAddBar={props.isEditMode}
      coreComponent={coreComponent}
      displayBarControls={props.isEditMode}
    />
  );
};
