import React from 'react';
import { tabOperations } from '../operations';
import { Section, SectionBar } from '../types';
import { CommonBarProps, updateRepeats } from './bar-commons';
import { BaseBarComponent } from './base-bar';
import { getSectionBarCore } from './section-bar-core';
import { SectionPicker, SectionPickerProps } from './section-picker';

export type SectionBarProps = CommonBarProps<SectionBar> & {
  section: Section;
};

export const SectionBarComponent: React.FC<SectionBarProps> = (props) => {
  const coreComponents = getSectionBarCore({
    bar: props.bar,
    isEditMode: props.isEditMode,
    section: props.section,
    strummingPatterns: props.tab.strummingPatterns,
    updateRepeats: (repeats) => updateRepeats(props.tab, props.updateTab, props.bar.index, repeats),
  });

  const changeSection: SectionPickerProps['changeSection'] = (sectionIndex) => {
    const nextTab = tabOperations.changeSection(props.tab, props.bar.index, sectionIndex);
    props.updateTab(nextTab);
  };

  return coreComponents.map(({ coreComponent }, index) => {
    const isFirst = index === 0;

    return (
      <BaseBarComponent
        {...props}
        additionalControls={
          <React.Fragment>
            {props.isEditMode && isFirst && (
              <SectionPicker
                changeSection={changeSection}
                section={props.section}
                sections={props.tab.sections}
              />
            )}
          </React.Fragment>
        }
        canAddBar={isFirst}
        coreComponent={coreComponent}
        displayBarControls={isFirst}
        inSection={undefined}
        key={index}
      />
    );
  });
};
