import React, { PropsWithChildren } from 'react';
import { BarType, removeSymbol } from '../constants';
import { getIndexDisplayValue } from '../operations';
import { Bar } from '../types';

export type BarControlsProps = PropsWithChildren<{
  bar: Bar;
  copyBar: () => void;
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
