import React from 'react';
import { PickingBar } from '../types';
import { CommonCoreProps, CoreComponent } from './bar-commons';
import { PickingFrameComponent } from './picking-frame';
import { Repeats } from './repeats';
import { TempoPicker } from './tempo-picker';

export type PickingBarCoreProps = CommonCoreProps & {
  bar: PickingBar;
  disabled?: boolean;
  displayPickingRebase?: boolean;
  rebase?: (framesNumber: number) => void;
  updateFrame?: (frameIndex: number, stringIndex: number, value: string) => void;
};

export const getPickingBarCore = (props: PickingBarCoreProps): CoreComponent => {
  const framesWidth = Math.floor(10000 / props.bar.frames.length) / 100;
  const backgroundColor = (props.isEditMode && props.disabled && props.backgroundColor) || 'white';
  const displayChordSupport = props.bar.frames.some((frame) => frame.chordSupport);

  return {
    additionalControls: props.displayPickingRebase && props.rebase && (
      <div style={{ marginRight: 8 }}>
        <TempoPicker framesNumber={props.bar.framesNumber} rebase={props.rebase} />
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
          className="frames"
          style={{
            backgroundColor,
            borderLeft: '1px solid black',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {props.bar.frames.map((frame) => {
            return (
              <PickingFrameComponent
                backgroundColor={backgroundColor}
                disabled={props.disabled}
                displayChordSupport={displayChordSupport}
                frame={frame}
                isEditMode={props.isEditMode}
                key={frame.index}
                style={{
                  borderLeft: frame.index > 0 ? '1px solid #ccc' : undefined,
                  boxSizing: 'border-box',
                  flexBasis: `${framesWidth}%`,
                }}
                update={(stringIndex, value) => {
                  props.updateFrame?.(frame.index, stringIndex, value);
                }}
              />
            );
          })}
        </div>
      </div>
    ),
  };
};
