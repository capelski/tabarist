import React from 'react';
import {
  addSymbol,
  editSymbol,
  framesNumberOptions,
  removeSymbol,
  saveSymbol,
  stringHeight,
} from '../constants';
import { PickingCompass } from '../types';
import { FrameComponent } from './frame';

export interface CompassProps {
  backgroundColor: string;
  compass: PickingCompass;
  currentIndex: number;
  editIndex: number;
  handlers: {
    addCompassBefore: () => void;
    copyCompass: () => void;
    editCompass: () => void;
    editCompassFinish: () => void;
    removeCompass: () => void;
    updateCompassValue: (frameIndex: number, stringIndex: number, value: string) => void;
    updateCompassFrames: (framesNumber: number) => void;
  };
  isEditMode: boolean;
  width: number;
}

export const CompassComponent: React.FC<CompassProps> = (props) => {
  const isEditModeCompass = props.currentIndex === props.editIndex;
  const isReference = props.compass.index !== props.currentIndex;
  const framesWidth = Math.floor(10000 / props.compass.frames.length) / 100;

  return (
    <div className="compass" style={{ flexBasis: `${props.width}%`, position: 'relative' }}>
      <div
        className="frames"
        style={{
          backgroundColor: props.backgroundColor,
          borderLeft: '1px solid black',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 8,
        }}
      >
        {props.compass.frames.map((frame, frameIndex) => {
          return (
            <FrameComponent
              backgroundColor={props.backgroundColor}
              frame={frame}
              frameIndex={frameIndex}
              isEditMode={isEditModeCompass}
              key={frameIndex}
              updateFrame={(stringIndex, value) => {
                props.handlers.updateCompassValue(frameIndex, stringIndex, value);
              }}
              width={framesWidth}
            />
          );
        })}
      </div>

      {props.isEditMode && !isEditModeCompass && (
        <button
          onClick={() => props.handlers.addCompassBefore()}
          style={{ height: stringHeight * 6, left: -4, padding: 0, position: 'absolute', top: 0 }}
          type="button"
        >
          {addSymbol}
        </button>
      )}

      {props.isEditMode && (
        <div
          className="controls"
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginBottom: 8,
          }}
        >
          <span style={{ marginRight: 8 }}>{props.currentIndex}</span>
          {isReference && (
            <span style={{ marginRight: 8 }}>
              ={'>'} {props.compass.index}
            </span>
          )}

          {!isReference && (
            <React.Fragment>
              {isEditModeCompass ? (
                <button
                  onClick={() => props.handlers.editCompassFinish()}
                  style={{ marginRight: 8 }}
                  type="button"
                >
                  {saveSymbol}
                </button>
              ) : (
                <button
                  onClick={() => props.handlers.editCompass()}
                  style={{ marginRight: 8 }}
                  type="button"
                >
                  {editSymbol}
                </button>
              )}

              <select
                onChange={(event) => {
                  props.handlers.updateCompassFrames(parseInt(event.target.value));
                }}
                style={{ marginRight: 8 }}
                value={props.compass.framesNumber}
              >
                {framesNumberOptions.map((option) => {
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </React.Fragment>
          )}

          <button
            onClick={() => props.handlers.copyCompass()}
            style={{ marginRight: 8 }}
            type="button"
          >
            =
          </button>

          <button onClick={() => props.handlers.removeCompass()} type="button">
            {removeSymbol}
          </button>
        </div>
      )}
    </div>
  );
};
