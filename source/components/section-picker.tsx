import React from 'react';
import { Section } from '../types';

export interface SectionPickerProps {
  changeSection: (sectionIndex: number) => void;
  section: Section;
  sections: Section[];
}

export const SectionPicker: React.FC<SectionPickerProps> = (props) => {
  return (
    <React.Fragment>
      Section:
      <select
        disabled={props.sections.length < 2}
        onChange={(event) => {
          const nextSectionIndex = parseInt(event.target.value);
          props.changeSection(nextSectionIndex);
        }}
        style={{ marginLeft: 8 }}
        value={props.section.index}
      >
        {props.sections.map((section) => {
          return (
            <option key={section.index} value={section.index}>
              {section.name}
            </option>
          );
        })}
      </select>
    </React.Fragment>
  );
};
