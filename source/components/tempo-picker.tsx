import React from 'react';
import { framesNumberOptions } from '../constants';

export type TempoPickerProps = {
  framesNumber: number;
  rebase: (framesNumber: number) => void;
};

export const TempoPicker: React.FC<TempoPickerProps> = (props) => {
  return (
    <React.Fragment>
      Tempo:
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
