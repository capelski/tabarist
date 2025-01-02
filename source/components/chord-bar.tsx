import React from 'react';
import { BarType } from '../constants';
import { tabOperations } from '../operations';
import { ChordBar, Section, Tab } from '../types';
import { BaseBarComponent } from './base-bar';
import { ChordBarCoreProps, getChordBarCore } from './chord-bar-core';
import { addBar, removeBar } from './common-handlers';

export type ChordBarProps = {
  bar: ChordBar;
  isEditMode: boolean;
  inSection?: Section;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  width: number;
};

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

  const { coreComponent } = getChordBarCore({
    backgroundColor: 'white',
    bar: props.bar,
    borderLeft: '1px solid black',
    displayStrummingPatternPicker: props.isEditMode,
    isEditMode: props.isEditMode,
    rebase,
    strummingPatterns: props.tab.strummingPatterns,
    updateFrame,
  });

  return (
    <BaseBarComponent
      addBar={(type) => addBar(props.tab, props.updateTab, props.bar.index, type, props.inSection)}
      allowInsertSection={!props.inSection}
      bar={props.bar}
      canAddBar={props.isEditMode}
      copyBar={() =>
        addBar(props.tab, props.updateTab, props.bar.index, BarType.reference, props.inSection)
      }
      coreComponent={coreComponent}
      displayBarControls={props.isEditMode}
      removeBar={() => removeBar(props.tab, props.updateTab, props.bar.index, props.inSection)}
      width={props.width}
    />
  );
};
