import React from 'react';
import { ChordBar, Section, StrummingPattern } from '../types';
import { AddBarPropsHandlers } from './add-bar';
import { BarControlsHandlers } from './bar-controls';
import { BaseBarComponent } from './base-bar';
import { getChordBarCore } from './chord-bar-core';

export type ChordBarProps = AddBarPropsHandlers &
  BarControlsHandlers & {
    bar: ChordBar;
    isEditMode: boolean;
    inSection?: Section;
    rebase?: (sPatternIndex: number) => void;
    strummingPatterns: StrummingPattern[];
    updateFrame?: (frameIndex: number, value: string) => void;
    width: number;
  };

export const ChordBarComponent: React.FC<ChordBarProps> = (props) => {
  const { coreComponent } = getChordBarCore({
    ...props,
    backgroundColor: 'white',
    borderLeft: '1px solid black',
    displayStrummingPatternPicker: props.isEditMode,
  });

  return (
    <BaseBarComponent
      {...props}
      allowInsertSection={!props.inSection}
      canAddBar={props.isEditMode}
      coreComponent={coreComponent}
      displayBarControls={props.isEditMode}
    />
  );
};
