import React from 'react';
import { framesNumberOptions } from '../constants';
import { PickingBar } from '../types';
import { PickingFrameComponent } from './picking-frame';

export type PickingBarCoreProps = {
  backgroundColor: string;
  bar: PickingBar;
  borderLeft?: string;
  disabled?: boolean;
  displayPickingRebase?: boolean;
  isEditMode: boolean;
  rebase?: (framesNumber: number) => void;
  updateFrame?: (frameIndex: number, stringIndex: number, value: string) => void;
};

export const getPickingBarCore = (props: PickingBarCoreProps) => {
  const framesWidth = Math.floor(10000 / props.bar.frames.length) / 100;

  return {
    additionalControls: props.displayPickingRebase && (
      <select
        onChange={(event) => {
          props.rebase?.(parseInt(event.target.value));
        }}
        style={{ marginRight: 8 }}
        value={props.bar.framesNumber}
      >
        {framesNumberOptions.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    ),
    coreComponent: (
      <div
        className="frames"
        style={{
          backgroundColor: props.backgroundColor,
          borderLeft: props.borderLeft,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
        }}
      >
        {props.bar.frames.map((frame) => {
          return (
            <PickingFrameComponent
              backgroundColor={props.backgroundColor}
              disabled={props.disabled}
              frame={frame}
              isEditMode={props.isEditMode}
              key={frame.index}
              style={{
                borderLeft: frame.index > 0 ? '1px solid #ccc' : undefined,
                boxSizing: 'border-box',
                width: `${framesWidth}%`,
              }}
              update={(stringIndex, value) => {
                props.updateFrame?.(frame.index, stringIndex, value);
              }}
            />
          );
        })}
      </div>
    ),
  };
};
