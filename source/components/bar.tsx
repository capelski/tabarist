import React from 'react';
import { addSymbol, BarType, framesNumberOptions, removeSymbol } from '../constants';
import { ChordBar, PickingBar, StrummingPattern } from '../types';
import { AddBar, AddBarProps } from './add-bar';
import { ChordFrame } from './chord-frame';
import { PickingFrameComponent } from './picking-frame';

export interface BarProps {
  backgroundColor: string;
  bar: ChordBar | PickingBar;
  currentIndex: number;
  handlers: {
    addStrummingPattern: () => void;
    addBar: AddBarProps['addBar'];
    copyBar: () => void;
    removeBar: () => void;
    updateChordBar: (frameIndex: number, value: string) => void;
    updateChordBarFrames: (sPatternIndex: number) => void;
    updatePickingBar: (frameIndex: number, stringIndex: number, value: string) => void;
    updatePickingBarFrames: (framesNumber: number) => void;
  };
  isEditMode: boolean;
  strummingPatterns: StrummingPattern[];
  width: number;
}

export const BarComponent: React.FC<BarProps> = (props) => {
  const isReference = props.bar.index !== props.currentIndex;
  const framesWidth = Math.floor(10000 / props.bar.frames.length) / 100;

  const strummingPattern =
    props.bar.type === BarType.chord
      ? props.strummingPatterns.find(
          (sPattern) => sPattern.index === (props.bar as ChordBar).sPatternIndex,
        )
      : undefined;

  return (
    <div
      className="bar"
      style={{ display: 'flex', flexDirection: 'column', width: `${props.width}%` }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, marginBottom: 8 }}>
        {props.isEditMode && <AddBar addBar={props.handlers.addBar} style={{ minHeight: 60 }} />}

        {props.bar.type === BarType.picking && (
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
                  key={frame.index}
                  updateFrame={(stringIndex, value) => {
                    props.handlers.updatePickingBar(frame.index, stringIndex, value);
                  }}
                  width={framesWidth}
                />
              );
            })}
          </div>
        )}

        {props.bar.type === BarType.chord && (
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
                      frame={(props.bar as ChordBar).frames[frame.index].value}
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
                        props.handlers.updateChordBar(frame.index, value);
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
                      props.handlers.updateChordBarFrames(sPatternIndex);
                    }}
                    style={{ marginLeft: 8, minWidth: 40 }}
                    value={props.bar.sPatternIndex}
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
              ={'>'} {props.bar.index + 1}
            </span>
          )}

          {!isReference && props.bar.type === BarType.picking && (
            <select
              onChange={(event) => {
                props.handlers.updatePickingBarFrames(parseInt(event.target.value));
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

          <button onClick={() => props.handlers.copyBar()} style={{ marginRight: 8 }} type="button">
            =
          </button>

          <button onClick={() => props.handlers.removeBar()} type="button">
            {removeSymbol}
          </button>
        </div>
      )}
    </div>
  );
};
