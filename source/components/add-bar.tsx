import React, { CSSProperties } from 'react';
import { BarType, moveEndSymbol, stringHeight } from '../constants';
import { barOperations } from '../operations';
import { Movement, Section } from '../types';

export type AddBarProps = {
  addBar: (type: BarType.chord | BarType.picking | BarType.section) => void;
  barIndex: number;
  expanded?: boolean;
  inSection: Section | undefined;
  moveBarEnd: () => void;
  movement: Movement | undefined;
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
      {props.movement &&
      props.movement.sectionIndex === props.inSection?.index &&
      barOperations.canMoveBarToPosition(props.movement.startIndex, props.barIndex) ? (
        <div
          onClick={() => {
            props.moveBarEnd();
          }}
          style={{ ...buttonStyle, backgroundColor: 'lightblue' }}
        >
          {moveEndSymbol}
        </div>
      ) : (
        <React.Fragment>
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

          {!props.inSection && (
            <div
              onClick={() => {
                props.addBar(BarType.section);
              }}
              style={buttonStyle}
            >
              📄{props.expanded ? ' section' : ''}
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};
