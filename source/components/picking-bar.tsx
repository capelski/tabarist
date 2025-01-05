import React from 'react';
import { tabOperations } from '../operations';
import { PickingBar } from '../types';
import { CommonNonSectionBarProps, updateRepeats } from './bar-commons';
import { BaseBarComponent } from './base-bar';
import { getPickingBarCore, PickingBarCoreProps } from './picking-bar-core';

export type PickingBarProps = CommonNonSectionBarProps<PickingBar>;

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
    bar: props.bar,
    displayPickingRebase: props.isEditMode,
    inSection: props.inSection,
    inSectionBar: undefined,
    isEditMode: props.isEditMode,
    isFirstBarInSectionBar: false,
    isLastBarInSectionBar: false,
    rebase,
    repeats: props.bar.repeats,
    sectionName: undefined,
    updateFrame,
    updateRepeats(repeats) {
      updateRepeats(props.tab, props.updateTab, props.bar.index, repeats, props.inSection);
    },
  });

  return (
    <BaseBarComponent
      {...props}
      additionalControls={additionalControls}
      canAddBar={true}
      coreComponent={coreComponent}
      displayBarControls={true}
    />
  );
};
