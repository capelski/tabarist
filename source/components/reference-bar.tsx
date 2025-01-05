import React from 'react';
import { BarType } from '../constants';
import { ChordBar, PickingBar, ReferenceBar } from '../types';
import { addBar, CommonNonSectionBarProps, removeBar } from './bar-commons';
import { BaseBarComponent } from './base-bar';
import { getReferenceBarCore } from './reference-bar-core';

export type ReferenceBarProps = CommonNonSectionBarProps<ReferenceBar> & {
  referencedBar: ChordBar | PickingBar;
};

export const ReferenceBarComponent: React.FC<ReferenceBarProps> = (props) => {
  const { additionalControls, coreComponent } = getReferenceBarCore({
    bar: props.bar,
    inSection: props.inSection,
    inSectionBar: undefined,
    isEditMode: props.isEditMode,
    isFirstBarInSectionBar: false,
    isLastBarInSectionBar: false,
    referencedBar: props.referencedBar,
    repeats: props.referencedBar.repeats,
    sectionName: undefined,
    strummingPatterns: props.tab.strummingPatterns,
    updateRepeats: undefined,
  });

  return (
    <BaseBarComponent
      addBar={(type) => addBar(props.tab, props.updateTab, props.bar.index, type, props.inSection)}
      additionalControls={additionalControls}
      allowInsertSection={!props.inSection}
      bar={props.bar}
      canAddBar={props.isEditMode}
      copyBar={() =>
        addBar(props.tab, props.updateTab, props.bar.index, BarType.reference, props.inSection)
      }
      coreComponent={coreComponent}
      inSection={props.inSection}
      isEditMode={props.isEditMode}
      removeBar={() => removeBar(props.tab, props.updateTab, props.bar.index, props.inSection)}
      width={props.width}
    />
  );
};
