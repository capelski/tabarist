import React, { CSSProperties } from 'react';
import { stringHeight } from '../constants';

export interface ChordFrameProps {
  frame: string;
  isEditMode: boolean;
  isReference: boolean;
  strumming: string;
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
        flexDirection: 'column',
        ...props.style,
      }}
    >
      <div className="chord">
        {props.isEditMode ? (
          <input
            disabled={props.isReference}
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
              width: '100%',
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

      <div className="strumming">{props.strumming}</div>
    </div>
  );
};
