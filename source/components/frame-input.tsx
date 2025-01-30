import React from 'react';
import { characterWidth, stringHeight } from '../constants';

export interface FrameInputProps {
  backgroundColor: string;
  canUpdate: boolean;
  isEditMode: boolean;
  update: (value: string) => void;
  value: string;
}

export const FrameValue: React.FC<FrameInputProps> = (props) => {
  return props.isEditMode && props.canUpdate ? (
    <input
      maxLength={3}
      onChange={(event) => {
        props.update(event.target.value);
      }}
      style={{
        boxSizing: 'border-box',
        flexGrow: 1,
        height: stringHeight,
        padding: 0,
        textAlign: 'center',
        width: props.value.length * characterWidth,
      }}
      value={props.value || ''}
    />
  ) : (
    <div
      style={{
        height: stringHeight,
      }}
    >
      <span style={{ backgroundColor: props.backgroundColor, transition: 'background-color 0.2s' }}>
        {props.value}
      </span>
    </div>
  );
};
