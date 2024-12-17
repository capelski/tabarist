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
}

export const CompassComponent: React.FC<CompassProps> = (props) => {
  const isEditMode = props.compassIndex === props.editingCompass;
  const framesWidth = Math.floor(10000 / props.compass.length) / 100;

  return (
    <div className="compass" style={{ flexBasis: '25%' }}>
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
              isEditMode={isEditMode}
              key={frameIndex}
              updateFrame={(stringIndex, value) => {
                props.handlers.updateCompass(frameIndex, stringIndex, value);
              }}
              width={framesWidth}
            />
          );
        })}
      </div>
      <div className="controls">
        <button onClick={() => props.handlers.copyCompass('before')} type="button">
          ⏪
        </button>
        {isEditMode ? (
          <button onClick={() => props.handlers.editCompassFinish()} type="button">
            ✅
          </button>
        ) : (
          <button onClick={() => props.handlers.editCompass()} type="button">
            🔧
          </button>
        )}
        <button onClick={() => props.handlers.clearCompass()} type="button">
          🗑️
        </button>
        <button onClick={() => props.handlers.removeCompass()} type="button">
          ❌
        </button>
        <button onClick={() => props.handlers.copyCompass('after')} type="button">
          ⏩
        </button>
      </div>
    </div>
  );
};
