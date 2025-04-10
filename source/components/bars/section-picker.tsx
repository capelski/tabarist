import React from 'react';
import { sectionNameMaxWidth } from '../../constants';
import { Section } from '../../types';

export type SectionPickerProps = {
  changeSection: (sectionIndex: number) => void;
  section: Section;
  sections: Section[];
};

export const SectionPicker: React.FC<SectionPickerProps> = (props) => {
  return (
    <select
      disabled={props.sections.length < 2}
      onChange={(event) => {
        const nextSectionIndex = parseInt(event.target.value);
        props.changeSection(nextSectionIndex);
      }}
      style={{ marginLeft: 8, maxWidth: sectionNameMaxWidth }}
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
  );
};
