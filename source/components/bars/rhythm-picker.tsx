import React from 'react';
import { Rhythm } from '../../types';

export type RhythmPickerProps = {
  rhythmIndex: number;
  rhythms: Rhythm[];
  setRhythm: (rhythm: Rhythm) => void;
};

export const RhythmPicker: React.FC<RhythmPickerProps> = (props) => {
  return (
    <React.Fragment>
      Rhythm:
      <select
        disabled={props.rhythms.length < 2}
        onChange={(event) => {
          const nextRhythmIndex = parseInt(event.target.value);
          const nextRhythm = props.rhythms.find((r) => r.index === nextRhythmIndex);
          if (nextRhythm) {
            props.setRhythm(nextRhythm);
          }
        }}
        style={{ marginLeft: 8 }}
        value={props.rhythmIndex}
      >
        {props.rhythms.map((rhythm) => {
          return (
            <option key={rhythm.index} value={rhythm.index}>
              {rhythm.name}
            </option>
          );
        })}
      </select>
    </React.Fragment>
  );
};
