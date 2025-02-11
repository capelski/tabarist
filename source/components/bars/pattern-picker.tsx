import React from 'react';
import { StrummingPattern } from '../../types';

export type PatternPickerProps = {
  rebase: (sPatternIndex: number) => void;
  sPatternIndex: number;
  strummingPatterns: StrummingPattern[];
};

export const PatternPicker: React.FC<PatternPickerProps> = (props) => {
  return (
    <React.Fragment>
      Pattern:
      <select
        disabled={props.strummingPatterns.length < 2}
        onChange={(event) => {
          const sPatternIndex = parseInt(event.target.value);
          props.rebase?.(sPatternIndex);
        }}
        style={{ marginLeft: 8 }}
        value={props.sPatternIndex}
      >
        {props.strummingPatterns.map((sPattern) => {
          return (
            <option key={sPattern.index} value={sPattern.index}>
              {sPattern.name}
            </option>
          );
        })}
      </select>
    </React.Fragment>
  );
};
