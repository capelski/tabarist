import React from 'react';
import { tabOperations } from '../operations';
import { Section, SectionBar } from '../types';
import { addBar, CommonBarProps, removeBar, updateRepeats } from './bar-commons';
import { BaseBarComponent } from './base-bar';
import { getSectionBarComponent } from './section-bar-core';
import { SectionPicker, SectionPickerProps } from './section-picker';

export type SectionBarProps = CommonBarProps<SectionBar> & {
  section: Section;
  sections: Section[];
};

export const SectionBarComponent: React.FC<SectionBarProps> = (props) => {
  const changeSection: SectionPickerProps['changeSection'] = (sectionIndex) => {
    const nextTab = tabOperations.changeSection(props.tab, props.bar.index, sectionIndex);
    props.updateTab(nextTab);
  };

  if (props.section.bars.length > 0) {
    return props.section.bars.map((nonSectionBar) => {
      const isFirst = nonSectionBar.index === 0;

      const { coreComponent } = getSectionBarComponent({
        bar: props.bar,
        isEditMode: props.isEditMode,
        isFirstBarInSectionBar: isFirst,
        isLastBarInSectionBar: nonSectionBar.index === props.section.bars.length - 1,
        referencedBar: nonSectionBar,
        repeats: props.bar.repeats,
        section: props.section,
        strummingPatterns: props.tab.strummingPatterns,
        updateRepeats: isFirst
          ? (repeats?: number) =>
              updateRepeats(props.tab, props.updateTab, props.bar.index, repeats)
          : undefined,
      });

      return (
        <BaseBarComponent
          addBar={(type) => addBar(props.tab, props.updateTab, props.bar.index, type)}
          additionalControls={
            <React.Fragment>
              {props.isEditMode && isFirst && (
                <SectionPicker
                  changeSection={changeSection}
                  section={props.section}
                  sections={props.sections}
                />
              )}
            </React.Fragment>
          }
          allowInsertSection={isFirst}
          bar={props.bar}
          canAddBar={props.isEditMode && isFirst}
          coreComponent={coreComponent}
          inSection={undefined}
          isEditMode={props.isEditMode && isFirst}
          key={nonSectionBar.index}
          removeBar={() => removeBar(props.tab, props.updateTab, props.bar.index)}
          width={props.width}
        />
      );
    });
  }

  const isFirst = true;
  const { coreComponent } = getSectionBarComponent({
    bar: props.bar,
    isEditMode: props.isEditMode,
    isFirstBarInSectionBar: isFirst,
    isLastBarInSectionBar: true,
    repeats: undefined,
    section: props.section,
    strummingPatterns: props.tab.strummingPatterns,
    updateRepeats: undefined,
  });

  return (
    props.isEditMode && (
      <BaseBarComponent
        addBar={(type) => addBar(props.tab, props.updateTab, props.bar.index, type)}
        additionalControls={
          <React.Fragment>
            {props.isEditMode && isFirst && (
              <SectionPicker
                changeSection={changeSection}
                section={props.section}
                sections={props.sections}
              />
            )}
          </React.Fragment>
        }
        allowInsertSection={isFirst}
        bar={props.bar}
        canAddBar={props.isEditMode && isFirst}
        coreComponent={coreComponent}
        inSection={undefined}
        isEditMode={props.isEditMode && isFirst}
        removeBar={() => removeBar(props.tab, props.updateTab, props.bar.index)}
        width={props.width}
      />
    )
  );
};
