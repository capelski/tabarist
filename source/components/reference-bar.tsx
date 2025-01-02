import React from 'react';
import { BarType } from '../constants';
import { ChordBar, PickingBar, ReferenceBar, Section, Tab } from '../types';
import { BaseBarComponent } from './base-bar';
import { addBar, removeBar } from './common-handlers';
import { getReferenceBarCore } from './reference-bar-core';

export type ReferenceBarProps = {
  bar: ReferenceBar;
  isEditMode: boolean;
  inSection?: Section;
  referencedBar: ChordBar | PickingBar;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  width: number;
};

export const ReferenceBarComponent: React.FC<ReferenceBarProps> = (props) => {
  const { additionalControls, coreComponent } = getReferenceBarCore({
    backgroundColor: props.isEditMode ? '#ddd' : 'white',
    bar: props.bar,
    borderLeft: '1px solid black',
    isEditMode: props.isEditMode,
    referencedBar: props.referencedBar,
    strummingPatterns: props.tab.strummingPatterns,
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
