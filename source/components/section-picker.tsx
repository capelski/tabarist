import React from 'react';
import { Section } from '../types';

export interface SectionPickerProps {
  changeSection: (sectionIndex: number) => void;
  section: Section;
  sections: Section[];
}

export const SectionPicker: React.FC<SectionPickerProps> = (props) => {
  return (
    <div>
      Section:
      <select
        disabled={props.sections.length < 2}
        onChange={(event) => {
          const nextSectionIndex = parseInt(event.target.value);
          props.changeSection(nextSectionIndex);
        }}
        value={props.section.index}
        style={{ marginRight: 8 }}
      >
        {props.sections.map((section) => {
          return (
            <option key={section.index} value={section.index}>
              {section.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};
