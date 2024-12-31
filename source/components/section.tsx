import React from 'react';
import { BarGroup } from '.';
import { tabOperations } from '../operations';
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
      <p>
        <input
          onChange={(event) => {
            const nextTab = tabOperations.renameSection(
              props.tab,
              props.section.index,
              event.target.value,
            );
            props.updateTab(nextTab);
          }}
          value={props.section.name}
        />
      </p>

      <BarGroup {...props} bars={props.section.bars} inSection={props.section} />
    </React.Fragment>
  );
};
