import React from 'react';
import { stringHeight } from '../constants';
import { ChordBar, StrummingPattern } from '../types';
import { CommonCoreProps, CoreComponent } from './bar-commons';
import { ChordFrame } from './chord-frame';
import { PatternPicker } from './pattern-picker';
import { Repeats } from './repeats';

export type ChordBarCoreProps = CommonCoreProps & {
  bar: ChordBar;
  disabled?: boolean;
  displayStrummingPatternPicker?: boolean;
  rebase?: (sPatternIndex: number) => void;
  strummingPatterns: StrummingPattern[];
  updateFrame?: (frameIndex: number, value: string) => void;
};

export const getChordBarCore = (props: ChordBarCoreProps): CoreComponent => {
  const framesWidth = Math.floor(10000 / props.bar.frames.length) / 100;
  const strummingPattern = props.strummingPatterns.find(
    (sPattern) => sPattern.index === props.bar.sPatternIndex,
  );

  return {
    additionalControls: props.displayStrummingPatternPicker && props.rebase && (
      <div style={{ marginRight: 8, textAlign: 'center' }}>
        <PatternPicker
          rebase={props.rebase}
          sPatternIndex={props.bar.sPatternIndex}
          strummingPatterns={props.strummingPatterns}
        />
      </div>
    ),
    coreComponent: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {!props.inSection && (
          <Repeats
            inSectionBar={props.inSectionBar}
            isEditMode={props.isEditMode}
            isFirstBarInSectionBar={props.isFirstBarInSectionBar}
            isLastBarInSectionBar={props.isLastBarInSectionBar}
            repeats={props.repeats}
            sectionName={props.sectionName}
            updateRepeats={props.updateRepeats}
          />
        )}

        <div
          style={{
            backgroundColor: props.isEditMode && props.disabled ? props.backgroundColor : 'white',
            borderLeft: '1px solid black',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            height: stringHeight * 6,
            justifyContent: 'center',
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
                    flexBasis: `${framesWidth}%`,
                  }}
                  update={(value) => {
                    props.updateFrame?.(frame.index, value);
                  }}
                  value={frame.value}
                />
              );
            })}
          </div>
        </div>
      </div>
    ),
  };
};
