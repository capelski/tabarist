import React from 'react';
import { BarType } from '../constants';
import { ChordBar, PickingBar, ReferenceBar, Section, Tab } from '../types';
import { addBar, removeBar } from './bar-commons';
import { BaseBarComponent } from './base-bar';
import { getReferenceBarCore } from './reference-bar-core';

export type ReferenceBarProps = {
  bar: ReferenceBar;
  inSection: Section | undefined;
  isEditMode: boolean;
  referencedBar: ChordBar | PickingBar;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  width: number;
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
