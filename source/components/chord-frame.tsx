import React, { CSSProperties } from 'react';
import { stringHeight } from '../constants';

export interface ChordFrameProps {
  frame: string;
  isEditMode: boolean;
  style?: CSSProperties;
  updateFrame: (value: string) => void;
}

export const ChordFrame: React.FC<ChordFrameProps> = (props) => {
  return (
    <div
      className="frame"
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        ...props.style,
      }}
    >
      <div
        className="chord"
        style={{
          textAlign: 'center',
        }}
      >
        {props.isEditMode ? (
          <input
            maxLength={3}
            onChange={(event) => {
              props.updateFrame(event.target.value);
            }}
            style={{
              boxSizing: 'border-box',
              height: stringHeight,
              maxWidth: 30,
              padding: 0,
              textAlign: 'center',
            }}
            value={props.frame || ''}
          />
        ) : (
          <div
            style={{
              height: stringHeight,
              minWidth: 25,
            }}
          >
            <span>{props.frame}</span>
          </div>
        )}
      </div>
    </div>
  );
};
