import React, { CSSProperties } from 'react';
import { CompassType } from '../constants';

export type AddCompassProps = {
  addCompass: (index: number, type: CompassType.chord | CompassType.picking) => void;
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
          props.addCompass(props.compassIndex, CompassType.picking);
        }}
        style={buttonStyle}
      >
        🎼{props.expanded ? ' picking compass' : ''}
      </div>

      <div
        onClick={() => {
          props.addCompass(props.compassIndex, CompassType.chord);
        }}
        style={buttonStyle}
      >
        🎵{props.expanded ? ' chord compass' : ''}
      </div>
    </div>
  );
};
