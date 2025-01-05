import React from 'react';
import { BarType } from '../constants';
import { tabOperations } from '../operations';
import { ChordBar } from '../types';
import { addBar, CommonNonSectionBarProps, removeBar, updateRepeats } from './bar-commons';
import { BaseBarComponent } from './base-bar';
import { ChordBarCoreProps, getChordBarCore } from './chord-bar-core';

export type ChordBarProps = CommonNonSectionBarProps<ChordBar>;

export const ChordBarComponent: React.FC<ChordBarProps> = (props) => {
  const rebase: ChordBarCoreProps['rebase'] = (sPatternIndex) => {
    const nextTab = tabOperations.rebaseChordBar(
      props.tab,
      props.bar.index,
      sPatternIndex,
      props.inSection,
    );
    props.updateTab(nextTab);
  };

  const updateFrame: ChordBarCoreProps['updateFrame'] = (frameIndex, value) => {
    const nextTab = tabOperations.updateChordFrame(
      props.tab,
      props.bar.index,
      frameIndex,
      value,
      props.inSection,
    );
    props.updateTab(nextTab);
  };

  const { additionalControls, coreComponent } = getChordBarCore({
    bar: props.bar,
    displayStrummingPatternPicker: props.isEditMode,
    inSection: props.inSection,
    inSectionBar: undefined,
    isEditMode: props.isEditMode,
    isFirstBarInSectionBar: false,
    isLastBarInSectionBar: false,
    rebase,
    repeats: props.bar.repeats,
    sectionName: undefined,
    strummingPatterns: props.tab.strummingPatterns,
    updateFrame,
    updateRepeats(repeats) {
      updateRepeats(props.tab, props.updateTab, props.bar.index, repeats, props.inSection);
    },
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
