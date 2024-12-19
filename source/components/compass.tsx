import React from 'react';
import { Compass } from '../types';
import { FrameComponent } from './frame';

export interface CompassProps {
  compass: Compass;
  compassIndex: number;
  editingCompass: number;
  handlers: {
    clearCompass: () => void;
    copyCompass: (position: 'before' | 'after') => void;
    editCompass: () => void;
    editCompassFinish: () => void;
    removeCompass: () => void;
    updateCompass: (frameIndex: number, stringIndex: number, value: string) => void;
  };
  isEditMode: boolean;
  width: number;
}

export const CompassComponent: React.FC<CompassProps> = (props) => {
  const isEditModeCompass = props.compassIndex === props.editingCompass;
  const framesWidth = Math.floor(10000 / props.compass.length) / 100;

  return (
    <div className="compass" style={{ flexBasis: `${props.width}%` }}>
      <div
        className="frames"
        style={{
          borderLeft: '1px solid black',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 8,
        }}
      >
        {props.compass.map((frame, frameIndex) => {
          return (
            <FrameComponent
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
      {props.isEditMode && (
        <div
          className="controls"
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button onClick={() => props.handlers.copyCompass('before')} type="button">
            ⏪
          </button>
          {isEditModeCompass ? (
            <button onClick={() => props.handlers.editCompassFinish()} type="button">
              ✅
            </button>
          ) : (
            <button onClick={() => props.handlers.editCompass()} type="button">
              🔧
            </button>
          )}
          <button onClick={() => props.handlers.clearCompass()} type="button">
            🗒️
          </button>
          <button onClick={() => props.handlers.removeCompass()} type="button">
            🗑️
          </button>
          <button onClick={() => props.handlers.copyCompass('after')} type="button">
            ⏩
          </button>
        </div>
      )}
    </div>
  );
};
