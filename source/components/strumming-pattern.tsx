import React from 'react';
import { framesNumberOptions, stringHeight } from '../constants';
import { getIndexDisplayValue } from '../logic';
import { StrummingPattern } from '../types';

export type StrummingPatternProps = {
  rebase: (framesNumber: number) => void;
  strummingPattern: StrummingPattern;
  update: (frameIndex: number, value: string) => void;
};

export const StrummingPatternComponent: React.FC<StrummingPatternProps> = (props) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex' }}>
        <p>{getIndexDisplayValue(props.strummingPattern.index)}&nbsp;</p>
        {props.strummingPattern.frames.map((frame) => {
          return (
            <div
              className="frame"
              key={frame.index}
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                className="chord"
                style={{
                  textAlign: 'center',
                }}
              >
                <input
                  maxLength={3}
                  onChange={(event) => {
                    props.update(frame.index, event.target.value);
                  }}
                  style={{
                    boxSizing: 'border-box',
                    height: stringHeight,
                    maxWidth: 30,
                    padding: 0,
                    textAlign: 'center',
                  }}
                  value={frame.value || ''}
                />
              </div>
            </div>
          );
        })}
      </div>

      <select
        onChange={(event) => {
          props.rebase(parseInt(event.target.value));
        }}
        value={props.strummingPattern.framesNumber}
      >
        {framesNumberOptions.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};
