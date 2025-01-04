import React, { CSSProperties } from 'react';
import { BarType, stringHeight } from '../constants';

export type AddBarPropsHandlers = {
  addBar: (type: BarType.chord | BarType.picking | BarType.section) => void;
};

export type AddBarProps = AddBarPropsHandlers & {
  allowInsertSection?: boolean;
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
        height: stringHeight * 6,
        ...props.style,
      }}
    >
      <div
        onClick={() => {
          props.addBar(BarType.picking);
        }}
        style={buttonStyle}
      >
        🎼{props.expanded ? ' picking bar' : ''}
      </div>

      <div
        onClick={() => {
          props.addBar(BarType.chord);
        }}
        style={buttonStyle}
      >
        🎵{props.expanded ? ' chord bar' : ''}
      </div>

      {props.allowInsertSection && (
        <div
          onClick={() => {
            props.addBar(BarType.section);
          }}
          style={buttonStyle}
        >
          📄{props.expanded ? ' section' : ''}
        </div>
      )}
    </div>
  );
};
