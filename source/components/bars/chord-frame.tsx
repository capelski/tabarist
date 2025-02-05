import React from 'react';
import { FrameValue } from './frame-input';

export interface ChordFrameProps {
  backgroundColor: string;
  canUpdate: boolean;
  isEditMode: boolean;
  isFirstFrame: boolean;
  strumming: string;
  update: (value: string) => void;
  value: string;
  width: string;
}

export const ChordFrame: React.FC<ChordFrameProps> = (props) => {
  return (
    <div
      className="frame"
      style={{
        alignItems: 'center',
        backgroundColor: props.backgroundColor,
        borderLeft: props.isFirstFrame ? undefined : '1px solid #ccc',
        boxSizing: 'border-box',
        display: 'flex',
        flexBasis: props.width,
        flexDirection: 'column',
        flexGrow: 1,
        transition: 'background-color 0.2s',
      }}
    >
      <div className="chord" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <FrameValue {...props} />
      </div>

      <div className="strumming">{props.strumming || '\u00A0'}</div>
    </div>
  );
};
