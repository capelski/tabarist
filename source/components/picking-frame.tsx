import React, { CSSProperties } from 'react';
import { PickingFrame } from '../types';
import { FrameValue } from './frame-input';

export interface PickingFrameProps {
  backgroundColor: string;
  disabled?: boolean;
  frame: PickingFrame;
  isEditMode: boolean;
  style?: CSSProperties;
  update: (stringIndex: number, value: string) => void;
}

export const PickingFrameComponent: React.FC<PickingFrameProps> = (props) => {
  return (
    <div className="frame" style={{ flexGrow: 1, ...props.style }}>
      {props.frame.strings.map((string) => {
        return (
          <div
            className="string"
            key={string.index}
            style={{
              background:
                'linear-gradient(180deg, transparent calc(50% - 1px), black calc(50%), transparent calc(50% + 1px)',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <FrameValue
              backgroundColor={props.backgroundColor}
              disabled={props.disabled}
              isEditMode={props.isEditMode}
              update={(value) => {
                props.update(string.index, value);
              }}
              value={string.value}
            />
          </div>
        );
      })}
    </div>
  );
};
