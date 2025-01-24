import React, { CSSProperties } from 'react';
import { FrameValue } from './frame-input';

export interface ChordFrameProps {
  disabled?: boolean;
  isEditMode: boolean;
  strumming: string;
  style?: CSSProperties;
  update: (value: string) => void;
  value: string;
}

export const ChordFrame: React.FC<ChordFrameProps> = (props) => {
  return (
    <div
      className="frame"
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        ...props.style,
      }}
    >
      <div className="chord" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <FrameValue {...props} />
      </div>

      <div className="strumming">{props.strumming}</div>
    </div>
  );
};
