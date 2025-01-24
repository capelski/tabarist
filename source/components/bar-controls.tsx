import React, { PropsWithChildren } from 'react';
import { BarType, cancelSymbol, moveStartSymbol, removeSymbol } from '../constants';
import { getIndexDisplayValue, sectionOperations } from '../operations';
import { Bar, Section, Tab } from '../types';

export type BarControlsProps = PropsWithChildren<{
  bar: Bar;
  cancelPositionOperation: () => void;
  copyBarStart: () => void;
  copying: Tab['copying'];
  inSection: Section | undefined;
  moveBarStart: () => void;
  moving: Tab['moving'];
  removeBar: () => void;
}>;

export const BarControls: React.FC<BarControlsProps> = (props) => {
  return (
    <div
      className="bar-controls"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <span style={{ marginBottom: 16, marginRight: 8 }}>
        {getIndexDisplayValue(props.bar.index)}
        {props.bar.type === BarType.reference && (
          <span style={{ marginLeft: 8 }}>
            ={'>'} {getIndexDisplayValue(props.bar.barIndex)}
          </span>
        )}
      </span>

      {props.moving &&
      sectionOperations.isOperationInSection(props.moving, props.inSection) &&
      props.moving.startIndex === props.bar.index ? (
        <button
          onClick={props.cancelPositionOperation}
          style={{ marginBottom: 16, marginRight: 8 }}
          type="button"
        >
          {cancelSymbol}
        </button>
      ) : (
        <button
          onClick={props.moveBarStart}
          style={{ marginBottom: 16, marginRight: 8 }}
          type="button"
        >
          {moveStartSymbol}
        </button>
      )}

      {props.copying &&
      sectionOperations.isOperationInSection(props.copying, props.inSection) &&
      props.copying.startIndex === props.bar.index ? (
        <button
          onClick={props.cancelPositionOperation}
          style={{ marginBottom: 16, marginRight: 8 }}
          type="button"
        >
          {cancelSymbol}
        </button>
      ) : (
        <button
          onClick={props.copyBarStart}
          style={{ marginBottom: 16, marginRight: 8 }}
          type="button"
        >
          =
        </button>
      )}

      <button onClick={props.removeBar} style={{ marginBottom: 16 }} type="button">
        {removeSymbol}
      </button>

      <div style={{ display: 'inline-block', marginBottom: 16, marginLeft: 8 }}>
        {props.children}
      </div>
    </div>
  );
};
