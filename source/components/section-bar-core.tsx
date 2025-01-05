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
import { CommonCoreProps } from './bar-commons';
import { getChordBarCore } from './chord-bar-core';
import { getPickingBarCore } from './picking-bar-core';
import { getReferenceBarCore } from './reference-bar-core';

export type SectionBarCoreProps = {
  bar: SectionBar;
  isEditMode: boolean;
  isFirstBarInSectionBar: boolean;
  isLastBarInSectionBar: boolean;
  referencedBar?: NonSectionBar;
  repeats: number | undefined;
  section: Section;
  strummingPatterns: StrummingPattern[];
  updateRepeats: ((repeats?: number) => void) | undefined;
};

export const getSectionBarComponent = (props: SectionBarCoreProps) => {
  const baseProps: CommonCoreProps = {
    inSection: undefined,
    inSectionBar: props.bar,
    isEditMode: props.isEditMode,
    isFirstBarInSectionBar: props.isFirstBarInSectionBar,
    isLastBarInSectionBar: props.isLastBarInSectionBar,
    repeats: props.bar.repeats,
    sectionName: props.section.name,
    updateRepeats: props.updateRepeats,
  };

  return !props.referencedBar
    ? {
        additionalControls: undefined,
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
};
