import React from 'react';
import { ChordBar, StrummingPattern } from '../types';
import { ChordFrame } from './chord-frame';

export type ChordBarCoreProps = {
  backgroundColor: string;
  bar: ChordBar;
  borderLeft?: string;
  disabled?: boolean;
  displayStrummingPatternPicker?: boolean;
  isEditMode: boolean;
  rebase?: (sPatternIndex: number) => void;
  strummingPatterns: StrummingPattern[];
  updateFrame?: (frameIndex: number, value: string) => void;
};

export const getChordBarCore = (props: ChordBarCoreProps) => {
  const framesWidth = Math.floor(10000 / props.bar.frames.length) / 100;
  const strummingPattern = props.strummingPatterns.find(
    (sPattern) => sPattern.index === props.bar.sPatternIndex,
  );

  return {
    additionalControls: undefined,
    coreComponent: (
      <div
        style={{
          backgroundColor: props.backgroundColor,
          borderLeft: props.borderLeft,
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
                disabled={props.disabled}
                isEditMode={props.isEditMode}
                key={frame.index}
                strumming={strummingPattern?.frames[frame.index]?.value ?? ''}
                style={{
                  borderLeft: frame.index > 0 ? '1px solid #ccc' : undefined,
                  boxSizing: 'border-box',
                  width: `${framesWidth}%`,
                }}
                update={(value) => {
                  props.updateFrame?.(frame.index, value);
                }}
                value={frame.value}
              />
            );
          })}
        </div>

        {props.displayStrummingPatternPicker && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            Strumming pattern:
            <select
              disabled={props.strummingPatterns.length < 2 || props.disabled}
              onChange={(event) => {
                const sPatternIndex = parseInt(event.target.value);
                props.rebase?.(sPatternIndex);
              }}
              style={{ marginLeft: 8, minWidth: 40 }}
              value={props.bar.sPatternIndex}
            >
              {props.strummingPatterns.map((sPattern) => {
                return (
                  <option key={sPattern.index} value={sPattern.index}>
                    {sPattern.name}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    ),
  };
};
