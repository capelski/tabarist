import React, { CSSProperties } from 'react';
import { BarType, moveEndSymbol, NonRefefenceBarType, stringHeight } from '../constants';
import { barOperations } from '../operations';
import { PositionOperation, Section } from '../types';

export type AddBarProps = {
  addBar: (type: NonRefefenceBarType) => void;
  barIndex: number;
  copyBarEnd: () => void;
  copying: PositionOperation | undefined;
  expanded?: boolean;
  inSection: Section | undefined;
  moveBarEnd: () => void;
  moving: PositionOperation | undefined;
  style?: CSSProperties;
};

const buttonStyleBase: CSSProperties = {
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'center',
  padding: '0 4px',
};

const addButtonStyle: CSSProperties = {
  ...buttonStyleBase,
  backgroundColor: '#eee',
};

const moveButtonStyle: CSSProperties = {
  ...buttonStyleBase,
  backgroundColor: 'lightblue',
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
      {props.moving &&
      props.moving.sectionIndex === props.inSection?.index &&
      barOperations.canMoveBarToPosition(props.moving.startIndex, props.barIndex) ? (
        <div onClick={props.moveBarEnd} style={moveButtonStyle}>
          {moveEndSymbol}
        </div>
      ) : props.copying && props.copying.sectionIndex === props.inSection?.index ? (
        <div onClick={props.copyBarEnd} style={moveButtonStyle}>
          {moveEndSymbol}
        </div>
      ) : (
        <React.Fragment>
          <div
            onClick={() => {
              props.addBar(BarType.picking);
            }}
            style={addButtonStyle}
          >
            🎼{props.expanded ? ' picking bar' : ''}
          </div>

          <div
            onClick={() => {
              props.addBar(BarType.chord);
            }}
            style={addButtonStyle}
          >
            🎵{props.expanded ? ' chord bar' : ''}
          </div>

          {!props.inSection && (
            <div
              onClick={() => {
                props.addBar(BarType.section);
              }}
              style={addButtonStyle}
            >
              📄{props.expanded ? ' section' : ''}
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};
