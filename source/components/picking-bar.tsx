import React from 'react';
import { BarType } from '../constants';
import { tabOperations } from '../operations';
import { PickingBar, Section, Tab } from '../types';
import { BaseBarComponent } from './base-bar';
import { addBar, removeBar } from './common-handlers';
import { getPickingBarCore, PickingBarCoreProps } from './picking-bar-core';

export type PickingBarProps = {
  bar: PickingBar;
  isEditMode: boolean;
  inSection?: Section;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  width: number;
};

export const PickingBarComponent: React.FC<PickingBarProps> = (props) => {
  const rebase: PickingBarCoreProps['rebase'] = (framesNumber) => {
    const nextTab = tabOperations.rebasePickingBar(
      props.tab,
      props.bar.index,
      framesNumber,
      props.inSection,
    );
    props.updateTab(nextTab);
  };

  const updateFrame: PickingBarCoreProps['updateFrame'] = (frameIndex, stringIndex, value) => {
    const nextTab = tabOperations.updatePickingFrame(
      props.tab,
      props.bar.index,
      frameIndex,
      stringIndex,
      value,
      props.inSection,
    );
    props.updateTab(nextTab);
  };

  const { additionalControls, coreComponent } = getPickingBarCore({
    backgroundColor: 'white',
    bar: props.bar,
    borderLeft: '1px solid black',
    displayPickingRebase: props.isEditMode,
    isEditMode: props.isEditMode,
    rebase,
    updateFrame,
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
      displayBarControls={props.isEditMode}
      removeBar={() => removeBar(props.tab, props.updateTab, props.bar.index, props.inSection)}
      width={props.width}
    />
  );
};
