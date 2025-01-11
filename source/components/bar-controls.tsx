import React, { PropsWithChildren } from 'react';
import { BarType, cancelSymbol, moveStartSymbol, removeSymbol } from '../constants';
import { getIndexDisplayValue } from '../operations';
import { Bar, Movement, Section } from '../types';

export type BarControlsProps = PropsWithChildren<{
  bar: Bar;
  copyBar: () => void;
  inSection: Section | undefined;
  moveBarCancel: () => void;
  moveBarStart: () => void;
  movement: Movement | undefined;
  removeBar: () => void;
}>;

export const BarControls: React.FC<BarControlsProps> = (props) => {
  return (
    <div
      className="bar-controls"
      style={{
        display: 'flex',
        justifyContent: 'end',
        marginBottom: 24,
        width: '100%',
      }}
    >
      {props.children}

      {props.movement &&
      props.movement.sectionIndex === props.inSection?.index &&
      props.movement.startIndex === props.bar.index ? (
        <button onClick={() => props.moveBarCancel()} style={{ marginRight: 8 }} type="button">
          {cancelSymbol}
        </button>
      ) : (
        <button onClick={() => props.moveBarStart()} style={{ marginRight: 8 }} type="button">
          {moveStartSymbol}
        </button>
      )}

      <button onClick={props.copyBar} style={{ marginRight: 8 }} type="button">
        =
      </button>

      <button onClick={() => props.removeBar()} type="button">
        {removeSymbol}
      </button>

      <span style={{ marginLeft: 8 }}>{getIndexDisplayValue(props.bar.index)}</span>
      {props.bar.type === BarType.reference && (
        <span style={{ marginLeft: 8 }}>
          ={'>'} {getIndexDisplayValue(props.bar.barIndex)}
        </span>
      )}
    </div>
  );
};
