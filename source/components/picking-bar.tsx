import React from 'react';
import { framesNumberOptions } from '../constants';
import { PickingBar } from '../types';
import { AddBar, AddBarProps } from './add-bar';
import { BarControls, BarControlsProps } from './bar-controls';
import { PickingFrameComponent } from './picking-frame';

export interface PickingBarProps {
  backgroundColor: string;
  bar: PickingBar;
  currentIndex: number;
  handlers: BarControlsProps['handlers'] & {
    addBar: AddBarProps['addBar'];
    updateFrames: (framesNumber: number) => void;
    updateValue: (frameIndex: number, stringIndex: number, value: string) => void;
  };
  isEditMode: boolean;
  width: number;
}

export const PickingBarComponent: React.FC<PickingBarProps> = (props) => {
  const framesWidth = Math.floor(10000 / props.bar.frames.length) / 100;
  const isReference = props.bar.index !== props.currentIndex;

  return (
    <div
      className="bar"
      style={{ display: 'flex', flexDirection: 'column', width: `${props.width}%` }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, marginBottom: 8 }}>
        {props.isEditMode && <AddBar addBar={props.handlers.addBar} style={{ minHeight: 60 }} />}

        <div
          className="frames"
          style={{
            backgroundColor: props.backgroundColor,
            borderLeft: '1px solid black',
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
                frame={frame}
                isEditMode={props.isEditMode}
                isReference={isReference}
                key={frame.index}
                updateValue={(stringIndex, value) => {
                  props.handlers.updateValue(frame.index, stringIndex, value);
                }}
                width={framesWidth}
              />
            );
          })}
        </div>
      </div>

      {props.isEditMode && (
        <BarControls bar={props.bar} currentIndex={props.currentIndex} handlers={props.handlers}>
          {!isReference && (
            <select
              onChange={(event) => {
                props.handlers.updateFrames(parseInt(event.target.value));
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
          )}
        </BarControls>
      )}
    </div>
  );
};
