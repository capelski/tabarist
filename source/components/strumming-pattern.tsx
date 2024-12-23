import React from 'react';
import { framesNumberOptions, stringHeight } from '../constants';
import { StrummingPattern } from '../types';

export type StrummingPatternProps = {
  strummingPattern: StrummingPattern;
  updateFrames: (framesNumber: number) => void;
  updateValue: (frameIndex: number, value: string) => void;
};

export const StrummingPatternComponent: React.FC<StrummingPatternProps> = (props) => {
  return (
    <div key={props.strummingPattern.index} style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex' }}>
        {props.strummingPattern.frames.map((frame, frameIndex) => {
          return (
            <div
              className="frame"
              key={frameIndex}
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
                    props.updateValue(frameIndex, event.target.value);
                  }}
                  style={{
                    boxSizing: 'border-box',
                    height: stringHeight,
                    maxWidth: 30,
                    padding: 0,
                    textAlign: 'center',
                  }}
                  value={frame || ''}
                />
              </div>
            </div>
          );
        })}
      </div>

      <select
        onChange={(event) => {
          props.updateFrames(parseInt(event.target.value));
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
