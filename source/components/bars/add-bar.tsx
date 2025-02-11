import React, { CSSProperties } from 'react';
import {
  addBarColor,
  BarType,
  moveEndSymbol,
  NonReferenceBarType,
  operationColor,
  stringHeight,
} from '../../constants';
import { barOperations, sectionOperations } from '../../operations';
import { Section, Tab } from '../../types';
import { addBar, copyBarEnd, moveBarEnd } from './bar-handlers';

export type AddBarProps = {
  barIndex: number;
  expanded?: boolean;
  inSection: Section | undefined;
  style?: CSSProperties;
  tab: Tab;
  updateTab: (tab: Tab) => void;
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
  const addBarHandler = (barType: NonReferenceBarType) => {
    addBar(props.tab, props.updateTab, props.barIndex, barType, props.inSection);
  };

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
      {props.tab.moving &&
      sectionOperations.isOperationInSection(props.tab.moving, props.inSection) &&
      barOperations.canMoveBarToPosition(props.tab.moving.startIndex, props.barIndex) ? (
        <div
          onClick={() => {
            moveBarEnd(props.tab, props.updateTab, props.barIndex, props.inSection);
          }}
          style={operationButtonStyle}
        >
          {moveEndSymbol}
        </div>
      ) : props.tab.copying &&
        sectionOperations.isOperationInSection(props.tab.copying, props.inSection) ? (
        <div
          onClick={() => {
            copyBarEnd(props.tab, props.updateTab, props.barIndex, props.inSection);
          }}
          style={operationButtonStyle}
        >
          {moveEndSymbol}
        </div>
      ) : (
        <React.Fragment>
          <div
            onClick={() => {
              addBarHandler(BarType.picking);
            }}
            style={addButtonStyle}
          >
            🎼{props.expanded ? ' picking bar' : ''}
          </div>

          <div
            onClick={() => {
              addBarHandler(BarType.chord);
            }}
            style={addButtonStyle}
          >
            🎵{props.expanded ? ' chord bar' : ''}
          </div>

          {!props.inSection && (
            <div
              onClick={() => {
                addBarHandler(BarType.section);
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
