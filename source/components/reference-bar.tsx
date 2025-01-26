import React from 'react';
import { BarType, referenceColor } from '../constants';
import { ChordBar, PickingBar, ReferenceBar, SectionBar } from '../types';
import { CommonNonSectionBarProps } from './bar-commons';
import { BaseBarComponent } from './base-bar';
import { getReferenceBarCore } from './reference-bar-core';

export type ReferenceBarProps = CommonNonSectionBarProps<ReferenceBar> & {
  referencedBar: ChordBar | PickingBar | SectionBar;
};

export const ReferenceBarComponent: React.FC<ReferenceBarProps> = (props) => {
  const components = getReferenceBarCore({
    backgroundColor: referenceColor,
    bar: props.bar,
    inSection: props.inSection,
    inSectionBar: undefined,
    isEditMode: props.isEditMode,
    isFirstBarInSectionBar: false,
    isLastBarInSectionBar: false,
    referencedBar: props.referencedBar,
    repeats: props.referencedBar.repeats,
    section:
      props.referencedBar.type === BarType.section
        ? props.tab.sections.find(
            (s) => s.index === (props.referencedBar as SectionBar).sectionIndex,
          )
        : undefined,
    sectionName: undefined,
    strummingPatterns: props.tab.strummingPatterns,
    updateRepeats: undefined,
  });

  return components.map(({ coreComponent }, index) => {
    const inSectionBar =
      props.referencedBar.type === BarType.section ? props.referencedBar : undefined;
    const isFirst = index === 0;
    const isEditableBar = !inSectionBar || isFirst;

    return (
      <BaseBarComponent
        {...props}
        canAddBar={isEditableBar}
        coreComponent={coreComponent}
        displayBarControls={isEditableBar}
        key={index}
      />
    );
  });
};
