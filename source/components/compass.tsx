import React from 'react';
import { addCompassSymbol, stringHeight } from '../constants';
import { Compass } from '../types';
import { FrameComponent } from './frame';

export interface CompassProps {
  backgroundColor: string;
  compass: Compass;
  currentIndex: number;
  editIndex: number;
  handlers: {
    addCompassBefore: () => void;
    copyCompass: () => void;
    editCompass: () => void;
    editCompassFinish: () => void;
    removeCompass: () => void;
    updateCompass: (frameIndex: number, stringIndex: number, value: string) => void;
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
                props.handlers.updateCompass(frameIndex, stringIndex, value);
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
          {addCompassSymbol}
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

          {isEditModeCompass ? (
            <button
              onClick={() => props.handlers.editCompassFinish()}
              style={{ marginRight: 8 }}
              type="button"
            >
              ✅
            </button>
          ) : (
            <button
              onClick={() => props.handlers.editCompass()}
              style={{ marginRight: 8 }}
              type="button"
            >
              🔧
            </button>
          )}

          <button
            onClick={() => props.handlers.copyCompass()}
            style={{ marginRight: 8 }}
            type="button"
          >
            =
          </button>

          <button onClick={() => props.handlers.removeCompass()} type="button">
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};
