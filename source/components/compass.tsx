import React from 'react';
import { editSymbol, framesNumberOptions, removeSymbol, saveSymbol } from '../constants';
import { ChordCompass, PickingCompass } from '../types';
import { AddCompass } from './add-compass';
import { ChordFrame } from './chord-frame';
import { PickingFrameComponent } from './picking-frame';

export interface CompassProps {
  backgroundColor: string;
  compass: ChordCompass | PickingCompass;
  currentIndex: number;
  editIndex: number;
  handlers: {
    addCompass: (newCompass: ChordCompass | PickingCompass) => void;
    copyCompass: () => void;
    editCompass: () => void;
    editCompassFinish: () => void;
    removeCompass: () => void;
    updateChordCompass: (frameIndex: number, value: string) => void;
    updateCompassFrames: (framesNumber: number) => void;
    updatePickingCompass: (frameIndex: number, stringIndex: number, value: string) => void;
  };
  isEditMode: boolean;
  width: number;
}

export const CompassComponent: React.FC<CompassProps> = (props) => {
  const isEditModeCompass = props.currentIndex === props.editIndex;
  const isReference = props.compass.index !== props.currentIndex;
  const framesWidth = Math.floor(10000 / props.compass.frames.length) / 100;

  return (
    <div
      className="compass"
      style={{ display: 'flex', flexDirection: 'column', flexBasis: `${props.width}%` }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, marginBottom: 8 }}>
        {props.isEditMode && (
          <AddCompass
            addCompass={props.handlers.addCompass}
            compassIndex={props.currentIndex}
            style={{ minHeight: 60 }}
          />
        )}
        <div
          className="frames"
          style={{
            backgroundColor: props.backgroundColor,
            borderLeft: '1px solid black',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            width: '100%',
          }}
        >
          {props.compass.type === 'picking'
            ? props.compass.frames.map((frame, frameIndex) => {
                return (
                  <PickingFrameComponent
                    backgroundColor={props.backgroundColor}
                    frame={frame}
                    frameIndex={frameIndex}
                    isEditMode={isEditModeCompass}
                    key={frameIndex}
                    updateFrame={(stringIndex, value) => {
                      props.handlers.updatePickingCompass(frameIndex, stringIndex, value);
                    }}
                    width={framesWidth}
                  />
                );
              })
            : props.compass.frames.map((frame, frameIndex) => {
                return (
                  <ChordFrame
                    frame={frame}
                    isEditMode={isEditModeCompass}
                    key={frameIndex}
                    style={{
                      borderLeft: props.isEditMode && frameIndex > 0 ? '1px solid #ccc' : undefined,
                      boxSizing: 'border-box',
                      width: `${framesWidth}%`,
                    }}
                    updateFrame={(value) => {
                      props.handlers.updateChordCompass(frameIndex, value);
                    }}
                  />
                );
              })}
        </div>
      </div>

      {props.isEditMode && (
        <div
          className="controls"
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginBottom: 24,
            width: '100%',
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
