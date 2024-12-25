import React from 'react';
import { removeSymbol } from '../constants';
import { getIndexDisplayValue } from '../logic';
import { ChordBar, PickingBar } from '../types';

export interface BarControlsProps {
  bar: ChordBar | PickingBar;
  children?: React.ReactNode;
  currentIndex: number;
  handlers: {
    copyBar: () => void;
    removeBar: () => void;
  };
}

export const BarControls: React.FC<BarControlsProps> = (props) => {
  const isReference = props.bar.index !== props.currentIndex;

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
      <span style={{ marginRight: 8 }}>{getIndexDisplayValue(props.currentIndex)}</span>
      {isReference && (
        <span style={{ marginRight: 8 }}>
          ={'>'} {getIndexDisplayValue(props.bar.index)}
        </span>
      )}

      {props.children}

      <button onClick={() => props.handlers.copyBar()} style={{ marginRight: 8 }} type="button">
        =
      </button>

      <button onClick={() => props.handlers.removeBar()} type="button">
        {removeSymbol}
      </button>
    </div>
  );
};
