import React from 'react';
import { addSymbol, BarType, framesNumberOptions, removeSymbol } from '../constants';
import { ChordBar, PickingBar, StrummingPattern } from '../types';
import { AddBar, AddBarProps } from './add-bar';
import { ChordFrame } from './chord-frame';
import { PickingFrameComponent } from './picking-frame';

export interface CompassProps {
  backgroundColor: string;
  compass: ChordBar | PickingBar;
  currentIndex: number;
  handlers: {
    addStrummingPattern: () => void;
    addBar: AddBarProps['addBar'];
    copyCompass: () => void;
    removeCompass: () => void;
    updateChordCompass: (frameIndex: number, value: string) => void;
    updateChordCompassFrames: (sPatternIndex: number) => void;
    updatePickingCompass: (frameIndex: number, stringIndex: number, value: string) => void;
    updatePickingCompassFrames: (framesNumber: number) => void;
  };
  isEditMode: boolean;
  strummingPatterns: StrummingPattern[];
  width: number;
}

export const CompassComponent: React.FC<CompassProps> = (props) => {
  const isReference = props.compass.index !== props.currentIndex;
  const framesWidth = Math.floor(10000 / props.compass.frames.length) / 100;

  const strummingPattern =
    props.compass.type === BarType.chord
      ? props.strummingPatterns.find(
          (sPattern) => sPattern.index === (props.compass as ChordBar).sPatternIndex,
        )
      : undefined;

  return (
    <div
      className="compass"
      style={{ display: 'flex', flexDirection: 'column', width: `${props.width}%` }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, marginBottom: 8 }}>
        {props.isEditMode && (
          <AddBar
            addBar={props.handlers.addBar}
            barIndex={props.currentIndex}
            style={{ minHeight: 60 }}
          />
        )}

        {props.compass.type === BarType.picking && (
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
            {props.compass.frames.map((frame) => {
              return (
                <PickingFrameComponent
                  backgroundColor={props.backgroundColor}
                  frame={frame}
                  isEditMode={props.isEditMode}
                  key={frame.index}
                  updateFrame={(stringIndex, value) => {
                    props.handlers.updatePickingCompass(frame.index, stringIndex, value);
                  }}
                  width={framesWidth}
                />
              );
            })}
          </div>
        )}

        {props.compass.type === BarType.chord && (
          <div
            style={{
              backgroundColor: props.backgroundColor,
              borderLeft: '1px solid black',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'center',
              padding: '8px 0',
            }}
          >
            <div
              className="frames"
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              {strummingPattern &&
                strummingPattern.frames.map((frame) => {
                  return (
                    <ChordFrame
                      frame={(props.compass as ChordBar).frames[frame.index].value}
                      isEditMode={props.isEditMode}
                      isReference={isReference}
                      key={frame.index}
                      strumming={frame.value}
                      style={{
                        borderLeft: frame.index > 0 ? '1px solid #ccc' : undefined,
                        boxSizing: 'border-box',
                        width: `${framesWidth}%`,
                      }}
                      updateFrame={(value) => {
                        props.handlers.updateChordCompass(frame.index, value);
                      }}
                    />
                  );
                })}
            </div>

            {props.isEditMode && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                Strumming pattern:
                {props.strummingPatterns.length === 0 ? (
                  <button
                    onClick={props.handlers.addStrummingPattern}
                    style={{ marginLeft: 8 }}
                    type="button"
                  >
                    {addSymbol}
                  </button>
                ) : (
                  <select
                    disabled={props.strummingPatterns.length < 2 || isReference}
                    onChange={(event) => {
                      const sPatternIndex = parseInt(event.target.value);
                      props.handlers.updateChordCompassFrames(sPatternIndex);
                    }}
                    style={{ marginLeft: 8, minWidth: 40 }}
                    value={props.compass.sPatternIndex}
                  >
                    {props.strummingPatterns.map((sPattern) => {
                      return (
                        <option key={sPattern.index} value={sPattern.index}>
                          {sPattern.index}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            )}
          </div>
        )}
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
          <span style={{ marginRight: 8 }}>{props.currentIndex + 1}</span>
          {isReference && (
            <span style={{ marginRight: 8 }}>
              ={'>'} {props.compass.index + 1}
            </span>
          )}

          {!isReference && props.compass.type === BarType.picking && (
            <select
              onChange={(event) => {
                props.handlers.updatePickingCompassFrames(parseInt(event.target.value));
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
