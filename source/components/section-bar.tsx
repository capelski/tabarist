import React from 'react';
import { BarType } from '../constants';
import {
  ChordBar,
  NonSectionBar,
  PickingBar,
  ReferenceBar,
  Section,
  SectionBar,
  StrummingPattern,
} from '../types';
import { AddBarPropsHandlers } from './add-bar';
import { BarControlsHandlers } from './bar-controls';
import { BaseBarComponent } from './base-bar';
import { getChordBarCore } from './chord-bar-core';
import { getPickingBarCore } from './picking-bar-core';
import { getReferenceBarCore } from './reference-bar-core';
import { SectionPicker } from './section-picker';

export type SectionBarProps = AddBarPropsHandlers &
  BarControlsHandlers & {
    bar: SectionBar;
    changeSection: (sectionIndex: number) => void;
    isEditMode: boolean;
    isFirst: boolean;
    referencedBar?: NonSectionBar;
    section: Section;
    sections: Section[];
    strummingPatterns: StrummingPattern[];
    width: number;
  };

export const SectionBarComponent: React.FC<SectionBarProps> = (props) => {
  const baseProps = {
    backgroundColor: props.isEditMode ? '#ddd' : 'white',
    borderLeft: props.isEditMode && !props.isFirst ? undefined : '1px solid black',
    isEditMode: props.isEditMode,
  };

  const { additionalControls, coreComponent } = !props.referencedBar
    ? {
        coreComponent: (
          <div
            style={{ alignItems: 'center', display: 'flex', flexGrow: 1, justifyContent: 'center' }}
          >
            Empty section
          </div>
        ),
      }
    : props.referencedBar.type === BarType.chord
    ? getChordBarCore({
        ...baseProps,
        bar: props.referencedBar,
        disabled: true,
        strummingPatterns: props.strummingPatterns,
      })
    : props.referencedBar.type === BarType.picking
    ? getPickingBarCore({
        ...baseProps,
        bar: props.referencedBar,
        disabled: true,
      })
    : getReferenceBarCore({
        ...baseProps,
        bar: props.referencedBar,
        referencedBar: props.section.bars.find(
          (b) => b.index === (props.referencedBar as ReferenceBar).barIndex,
        ) as ChordBar | PickingBar,
        strummingPatterns: props.strummingPatterns,
      });

  return (
    <React.Fragment>
      <BaseBarComponent
        {...props}
        additionalControls={
          <React.Fragment>
            {props.isEditMode && props.isFirst && (
              <SectionPicker
                changeSection={props.changeSection}
                section={props.section}
                sections={props.sections}
              />
            )}
            {additionalControls}
          </React.Fragment>
        }
        allowInsertSection={props.isFirst}
        canAddBar={props.isEditMode && props.isFirst}
        coreComponent={coreComponent}
        displayBarControls={props.isEditMode && props.isFirst}
      />
    </React.Fragment>
  );
};
