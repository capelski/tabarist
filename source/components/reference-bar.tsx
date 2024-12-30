import React from 'react';
import { ChordBar, PickingBar, ReferenceBar, Section, StrummingPattern } from '../types';
import { AddBarPropsHandlers } from './add-bar';
import { BarControlsHandlers } from './bar-controls';
import { BaseBarComponent } from './base-bar';
import { getReferenceBarCore } from './reference-bar-core';

export type ReferenceBarProps = AddBarPropsHandlers &
  BarControlsHandlers & {
    bar: ReferenceBar;
    isEditMode: boolean;
    inSection?: Section;
    referencedBar: ChordBar | PickingBar;
    strummingPatterns: StrummingPattern[];
    width: number;
  };

export const ReferenceBarComponent: React.FC<ReferenceBarProps> = (props) => {
  const { additionalControls, coreComponent } = getReferenceBarCore({
    backgroundColor: props.isEditMode ? '#ddd' : 'white',
    bar: props.bar,
    borderLeft: '1px solid black',
    isEditMode: props.isEditMode,
    referencedBar: props.referencedBar,
    strummingPatterns: props.strummingPatterns,
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
