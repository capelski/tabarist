import React from 'react';
import { BarGroup } from '.';
import { tabService } from '../logic';
import { Section, Tab } from '../types';

export type SectionProps = {
  addStrummingPattern: () => void;
  isEditMode: boolean;
  section: Section;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const SectionComponent: React.FC<SectionProps> = (props) => {
  return (
    <React.Fragment>
      <input
        onChange={(event) => {
          const nextTab = tabService.renameSection(
            props.tab,
            props.section.index,
            event.target.value,
          );
          props.updateTab(nextTab);
        }}
        value={props.section.name}
      />

      <BarGroup {...props} bars={props.section.bars} inSection={props.section} />
    </React.Fragment>
  );
};
