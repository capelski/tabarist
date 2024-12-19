import React from 'react';
import { stringHeight } from '../constants';
import { Frame } from '../types';

export interface FrameProps {
  frame: Frame;
  frameIndex: number;
  isEditMode: boolean;
  updateFrame: (stringIndex: number, value: string) => void;
  width: number;
}

export const FrameComponent: React.FC<FrameProps> = (props) => {
  return (
    <div className="frame" style={{ width: `${props.width}%` }}>
      {[...props.frame].map((string, stringIndex) => {
        return (
          <div
            className="string"
            key={stringIndex}
            style={{
              background:
                'linear-gradient(180deg, white calc(50% - 1px), black calc(50%), white calc(50% + 1px)',
              textAlign: 'center',
            }}
          >
            {props.isEditMode ? (
              <input
                maxLength={3}
                onChange={(event) => {
                  props.updateFrame(stringIndex, event.target.value);
                }}
                style={{
                  boxSizing: 'border-box',
                  height: stringHeight,
                  maxWidth: 30,
                  padding: 0,
                  textAlign: 'center',
                }}
                value={string || ''}
              />
            ) : (
              <div
                style={{
                  height: stringHeight,
                  padding: '0 4px',
                }}
              >
                <span style={{ backgroundColor: 'white' }}>{string}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
