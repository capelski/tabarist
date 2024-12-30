import React, { PropsWithChildren } from 'react';
import { BarType, removeSymbol } from '../constants';
import { getIndexDisplayValue } from '../logic';
import { Bar } from '../types';

export type BarControlsHandlers = {
  copyBar?: () => void;
  removeBar: () => void;
};

export type BarControlsProps = BarControlsHandlers &
  PropsWithChildren<{
    currentBar: Bar;
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

      {props.copyBar && (
        <button onClick={props.copyBar} style={{ marginRight: 8 }} type="button">
          =
        </button>
      )}

      <button onClick={() => props.removeBar()} type="button">
        {removeSymbol}
      </button>

      <span style={{ marginLeft: 8 }}>{getIndexDisplayValue(props.currentBar.index)}</span>
      {props.currentBar.type === BarType.reference && (
        <span style={{ marginLeft: 8 }}>
          ={'>'} {getIndexDisplayValue(props.currentBar.barIndex)}
        </span>
      )}
    </div>
  );
};
