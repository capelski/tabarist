import React, { CSSProperties } from 'react';
import { BarType } from '../constants';

export type AddBarProps = {
  addBar: (index: number, type: BarType.chord | BarType.picking) => void;
  barIndex: number;
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

export const AddBar: React.FC<AddBarProps> = (props) => {
  return (
    <div
      className="add-bar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...props.style,
      }}
    >
      <div
        onClick={() => {
          props.addBar(props.barIndex, BarType.picking);
        }}
        style={buttonStyle}
      >
        🎼{props.expanded ? ' picking bar' : ''}
      </div>

      <div
        onClick={() => {
          props.addBar(props.barIndex, BarType.chord);
        }}
        style={buttonStyle}
      >
        🎵{props.expanded ? ' chord bar' : ''}
      </div>
    </div>
  );
};
