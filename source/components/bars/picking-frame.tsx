import React from 'react';
import { IndexedValue, PickingFrame } from '../../types';
import { FrameValue } from './frame-input';

export interface PickingFrameProps {
  backgroundColor: string;
  canUpdate: boolean;
  displayChordSupport: boolean;
  frame: PickingFrame;
  isEditMode: boolean;
  isFirstFrame: boolean;
  update: (stringIndex: number, value: string) => void;
  width: string;
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
    <div
      className="frame"
      style={{
        borderLeft: props.isFirstFrame ? undefined : '1px solid #ccc',
        boxSizing: 'border-box',
        flexBasis: props.width,
        flexGrow: 1,
      }}
    >
      {parts.map((part) => {
        return (
          <div
            className="string"
            key={part.index}
            style={{
              background: part.isString
                ? `linear-gradient(180deg, ${props.backgroundColor} calc(50% - 1px), black calc(50%), ${props.backgroundColor} calc(50% + 1px)`
                : props.isEditMode
                ? props.backgroundColor
                : undefined,
              display: 'flex',
              justifyContent: 'center',
              marginTop: part.isString ? undefined : 8,
              transition: 'background-color 0.2s',
              width: '100%',
            }}
          >
            <FrameValue
              backgroundColor={
                part.isString
                  ? props.backgroundColor
                  : props.isEditMode
                  ? props.backgroundColor
                  : 'white'
              }
              canUpdate={props.canUpdate}
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
