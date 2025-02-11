import React from 'react';
import { framesNumberOptions } from '../../constants';

export type DivisionsPickerProps = {
  framesNumber: number;
  rebase: (framesNumber: number) => void;
};

export const DivisionsPicker: React.FC<DivisionsPickerProps> = (props) => {
  return (
    <React.Fragment>
      Divisions:
      <select
        onChange={(event) => {
          props.rebase(parseInt(event.target.value));
        }}
        style={{ marginLeft: 8 }}
        value={props.framesNumber}
      >
        {framesNumberOptions.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </React.Fragment>
  );
};
