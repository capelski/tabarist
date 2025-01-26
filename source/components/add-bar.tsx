import React, { CSSProperties } from 'react';
import {
  addBarColor,
  BarType,
  moveEndSymbol,
  NonReferenceBarType,
  operationColor,
  stringHeight,
} from '../constants';
import { barOperations, sectionOperations } from '../operations';
import { Section, Tab } from '../types';

export type AddBarProps = {
  addBar: (type: NonReferenceBarType) => void;
  barIndex: number;
  copyBarEnd: () => void;
  copying: Tab['copying'];
  expanded?: boolean;
  inSection: Section | undefined;
  moveBarEnd: () => void;
  moving: Tab['moving'];
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
  backgroundColor: addBarColor,
};

const operationButtonStyle: CSSProperties = {
  ...buttonStyleBase,
  backgroundColor: operationColor,
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
      sectionOperations.isOperationInSection(props.moving, props.inSection) &&
      barOperations.canMoveBarToPosition(props.moving.startIndex, props.barIndex) ? (
        <div onClick={props.moveBarEnd} style={operationButtonStyle}>
          {moveEndSymbol}
        </div>
      ) : props.copying &&
        sectionOperations.isOperationInSection(props.copying, props.inSection) ? (
        <div onClick={props.copyBarEnd} style={operationButtonStyle}>
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
