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
  Tab,
} from '../types';
import { AddBarPropsHandlers } from './add-bar';
import { CommonCoreProps, updateRepeats } from './bar-commons';
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
    isLast: boolean;
    referencedBar?: NonSectionBar;
    section: Section;
    sections: Section[];
    strummingPatterns: StrummingPattern[];
    tab: Tab;
    updateRepeats?: (repeats?: number) => void;
    updateTab: (tab: Tab) => void;
    width: number;
  };

export const SectionBarComponent: React.FC<SectionBarProps> = (props) => {
  const baseProps: CommonCoreProps = {
    inSection: undefined,
    inSectionBar: props.bar,
    isEditMode: props.isEditMode,
    isFirstBarInSectionBar: props.isFirst,
    isLastBarInSectionBar: props.isLast,
    repeats: props.bar.repeats,
    sectionName: props.section.name,
    updateRepeats: props.isFirst
      ? (repeats?: number) => updateRepeats(props.tab, props.updateTab, props.bar.index, repeats)
      : undefined,
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
    <BaseBarComponent
      addBar={props.addBar}
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
      bar={props.bar}
      canAddBar={props.isEditMode && props.isFirst}
      coreComponent={coreComponent}
      inSection={undefined}
      isEditMode={props.isEditMode && props.isFirst}
      removeBar={props.removeBar}
      width={props.width}
    />
  );
};
