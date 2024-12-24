import React from 'react';
import { stringHeight } from '../constants';
import { PickingFrame } from '../types';

export interface PickingFrameProps {
  backgroundColor: string;
  frame: PickingFrame;
  isEditMode: boolean;
  updateFrame: (stringIndex: number, value: string) => void;
  width: number;
}

export const PickingFrameComponent: React.FC<PickingFrameProps> = (props) => {
  return (
    <div className="frame" style={{ width: `${props.width}%` }}>
      {props.frame.strings.map((string) => {
        return (
          <div
            className="string"
            key={string.index}
            style={{
              background:
                'linear-gradient(180deg, transparent calc(50% - 1px), black calc(50%), transparent calc(50% + 1px)',
              textAlign: 'center',
            }}
          >
            {props.isEditMode ? (
              <input
                maxLength={3}
                onChange={(event) => {
                  props.updateFrame(string.index, event.target.value);
                }}
                style={{
                  boxSizing: 'border-box',
                  height: stringHeight,
                  maxWidth: 30,
                  padding: 0,
                  textAlign: 'center',
                  width: '100%',
                }}
                value={string.value || ''}
              />
            ) : (
              <div
                style={{
                  height: stringHeight,
                  padding: '0 4px',
                }}
              >
                <span style={{ backgroundColor: props.backgroundColor }}>{string.value}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
