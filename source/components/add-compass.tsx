import React, { CSSProperties } from 'react';
import { createChordCompass, createPickingCompass } from '../logic';
import { ChordCompass, PickingCompass } from '../types';

export type AddCompassProps = {
  addCompass: (compass: ChordCompass | PickingCompass) => void;
  compassIndex: number;
  expanded?: boolean;
  style?: CSSProperties;
};

const buttonStyle: CSSProperties = {
  alignItems: 'center',
  backgroundColor: '#eee',
  cursor: 'pointer',
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'center',
  padding: '0 4px',
};

export const AddCompass: React.FC<AddCompassProps> = (props) => {
  return (
    <div
      className="add-compass"
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...props.style,
      }}
    >
      <div
        onClick={() => {
          props.addCompass(createPickingCompass(props.compassIndex));
        }}
        style={buttonStyle}
      >
        🎼{props.expanded ? ' picking compass' : ''}
      </div>

      <div
        onClick={() => {
          props.addCompass(createChordCompass(props.compassIndex));
        }}
        style={buttonStyle}
      >
        🎵{props.expanded ? ' chord compass' : ''}
      </div>
    </div>
  );
};
