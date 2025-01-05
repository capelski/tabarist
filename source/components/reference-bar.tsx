import React from 'react';
import { BarType } from '../constants';
import { ChordBar, PickingBar, ReferenceBar, SectionBar } from '../types';
import { addBar, CommonNonSectionBarProps, removeBar } from './bar-commons';
import { BaseBarComponent } from './base-bar';
import { getReferenceBarCore } from './reference-bar-core';

export type ReferenceBarProps = CommonNonSectionBarProps<ReferenceBar> & {
  referencedBar: ChordBar | PickingBar | SectionBar;
};

export const ReferenceBarComponent: React.FC<ReferenceBarProps> = (props) => {
  const components = getReferenceBarCore({
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
        addBar={(type) =>
          addBar(props.tab, props.updateTab, props.bar.index, type, props.inSection)
        }
        allowInsertSection={!props.inSection}
        bar={props.bar}
        canAddBar={isEditableBar}
        copyBar={() =>
          addBar(props.tab, props.updateTab, props.bar.index, BarType.reference, props.inSection)
        }
        coreComponent={coreComponent}
        displayBarControls={isEditableBar}
        inSection={props.inSection}
        isEditMode={props.isEditMode}
        key={index}
        removeBar={() => removeBar(props.tab, props.updateTab, props.bar.index, props.inSection)}
        width={props.width}
      />
    );
  });
};
