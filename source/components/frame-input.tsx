import React from 'react';
import { characterWidth, stringHeight } from '../constants';

export interface FrameInputProps {
  backgroundColor?: string;
  disabled?: boolean;
  isEditMode: boolean;
  update: (value: string) => void;
  value: string;
}

export const FrameValue: React.FC<FrameInputProps> = (props) => {
  return props.isEditMode ? (
    <input
      disabled={props.disabled}
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
      <span style={{ backgroundColor: props.backgroundColor }}>{props.value}</span>
    </div>
  );
};
