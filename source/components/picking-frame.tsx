import React, { CSSProperties } from 'react';
import { IndexedValue, PickingFrame } from '../types';
import { FrameValue } from './frame-input';

export interface PickingFrameProps {
  backgroundColor: string;
  disabled?: boolean;
  displayChordSupport: boolean;
  frame: PickingFrame;
  isEditMode: boolean;
  style?: CSSProperties;
  update: (stringIndex: number, value: string) => void;
}

export const PickingFrameComponent: React.FC<PickingFrameProps> = (props) => {
  const parts: (IndexedValue & { isString: boolean })[] = props.frame.strings.map((s) => ({
    ...s,
    isString: true,
  }));

  if (props.isEditMode || props.displayChordSupport) {
    parts.push({
      index: props.frame.strings.length,
      isString: false,
      value: props.frame.chordSupport ?? '',
    });
  }

  return (
    <div className="frame" style={{ flexGrow: 1, ...props.style }}>
      {parts.map((part) => {
        return (
          <div
            className="string"
            key={part.index}
            style={{
              background: part.isString
                ? 'linear-gradient(180deg, transparent calc(50% - 1px), black calc(50%), transparent calc(50% + 1px)'
                : undefined,
              display: 'flex',
              justifyContent: 'center',
              marginTop: part.isString ? undefined : 8,
              width: '100%',
            }}
          >
            <FrameValue
              backgroundColor={props.backgroundColor}
              disabled={props.disabled}
              isEditMode={props.isEditMode}
              update={(value) => {
                props.update(part.index, value);
              }}
              value={part.value}
            />
          </div>
        );
      })}
    </div>
  );
};
