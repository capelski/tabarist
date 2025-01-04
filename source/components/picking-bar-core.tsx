import React from 'react';
import { framesNumberOptions } from '../constants';
import { PickingBar } from '../types';
import { CommonCoreProps } from './bar-commons';
import { PickingFrameComponent } from './picking-frame';
import { Repeats } from './repeats';

export type PickingBarCoreProps = CommonCoreProps & {
  bar: PickingBar;
  disabled?: boolean;
  displayPickingRebase?: boolean;
  rebase?: (framesNumber: number) => void;
  updateFrame?: (frameIndex: number, stringIndex: number, value: string) => void;
};

export const getPickingBarCore = (props: PickingBarCoreProps) => {
  const framesWidth = Math.floor(10000 / props.bar.frames.length) / 100;
  const backgroundColor = props.isEditMode && props.disabled ? '#ddd' : 'white';

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
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {!props.inSection && (
          <Repeats
            inSectionBar={props.inSectionBar}
            isEditMode={props.isEditMode}
            isFirstBarInSectionBar={props.isFirstBarInSectionBar}
            isLastBarInSectionBar={props.isLastBarInSectionBar}
            repeats={props.repeats}
            updateRepeats={props.updateRepeats}
          />
        )}

        <div
          className="frames"
          style={{
            backgroundColor,
            borderLeft:
              !props.isEditMode || !props.inSectionBar || props.isFirstBarInSectionBar
                ? '1px solid black'
                : undefined,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {props.bar.frames.map((frame) => {
            return (
              <PickingFrameComponent
                backgroundColor={backgroundColor}
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
      </div>
    ),
  };
};
