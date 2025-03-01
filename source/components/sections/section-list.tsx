import React from 'react';
import { addSymbol } from '../../constants';
import { tabOperations } from '../../operations';
import { Tab } from '../../types';
import { SectionComponent } from './section';

export type SectionListProps = {
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const SectionList: React.FC<SectionListProps> = (props) => {
  const addSection = () => {
    props.updateTab(tabOperations.addSection(props.tab));
  };

  return (
    <div className="section-list">
      <h3>Sections</h3>

      {props.tab.sections.map((section) => {
        return (
          <SectionComponent
            isEditMode={true}
            key={section.index}
            section={section}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        );
      })}

      <p>
        <button onClick={addSection} type="button">
          {addSymbol} section
        </button>
      </p>
    </div>
  );
};
