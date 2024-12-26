import React from 'react';
import { addSymbol } from '../constants';
import { getIndexDisplayValue } from '../logic';
import { ChordBar, StrummingPattern } from '../types';
import { AddBar, AddBarProps } from './add-bar';
import { BarControls, BarControlsProps } from './bar-controls';
import { ChordFrame } from './chord-frame';

export interface ChordBarProps {
  backgroundColor: string;
  bar: ChordBar;
  currentIndex: number;
  handlers: BarControlsProps['handlers'] & {
    addBar: AddBarProps['addBar'];
    addStrummingPattern: () => void;
    rebase: (sPatternIndex: number) => void;
    updateFrame: (frameIndex: number, value: string) => void;
  };
  isEditMode: boolean;
  strummingPatterns: StrummingPattern[];
  width: number;
}

export const ChordBarComponent: React.FC<ChordBarProps> = (props) => {
  const framesWidth = Math.floor(10000 / props.bar.frames.length) / 100;
  const isReference = props.bar.index !== props.currentIndex;
  const strummingPattern = props.strummingPatterns.find(
    (sPattern) => sPattern.index === props.bar.sPatternIndex,
  );

  return (
    <div
      className="bar"
      style={{ display: 'flex', flexDirection: 'column', width: `${props.width}%` }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, marginBottom: 8 }}>
        {props.isEditMode && <AddBar addBar={props.handlers.addBar} style={{ minHeight: 60 }} />}

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
            {props.bar.frames.map((frame) => {
              return (
                <ChordFrame
                  isEditMode={props.isEditMode}
                  isReference={isReference}
                  key={frame.index}
                  strumming={strummingPattern?.frames[frame.index]?.value ?? ''}
                  style={{
                    borderLeft: frame.index > 0 ? '1px solid #ccc' : undefined,
                    boxSizing: 'border-box',
                    width: `${framesWidth}%`,
                  }}
                  update={(value) => {
                    props.handlers.updateFrame(frame.index, value);
                  }}
                  value={frame.value}
                />
              );
            })}
          </div>

          {props.isEditMode && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              Strumming pattern:
              {props.strummingPatterns.length === 0 ? (
                <button
                  disabled={isReference}
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
                    props.handlers.rebase(sPatternIndex);
                  }}
                  style={{ marginLeft: 8, minWidth: 40 }}
                  value={props.bar.sPatternIndex}
                >
                  {props.strummingPatterns.map((sPattern) => {
                    return (
                      <option key={sPattern.index} value={sPattern.index}>
                        {getIndexDisplayValue(sPattern.index)}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          )}
        </div>
      </div>

      {props.isEditMode && (
        <BarControls bar={props.bar} currentIndex={props.currentIndex} handlers={props.handlers} />
      )}
    </div>
  );
};
