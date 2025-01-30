import React from 'react';
import { stringHeight } from '../constants';
import { tabOperations } from '../operations';
import { BarContainer, ChordBar, StrummingPattern } from '../types';
import { BarComponentBaseProps, getFrameBackgroundColor } from './bar-commons';
import { ChordFrame } from './chord-frame';

export type ChordBarCoreProps = BarComponentBaseProps & {
  container: BarContainer<ChordBar>;
  strummingPatterns: StrummingPattern[];
};

export const ChordBarComponent: React.FC<ChordBarCoreProps> = (props) => {
  const framesWidth = Math.floor(10000 / props.container.renderedBar.frames.length) / 100;
  const strummingPattern = props.strummingPatterns.find(
    (sPattern) => sPattern.index === props.container.renderedBar.sPatternIndex,
  );

  return (
    <div
      style={{
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
        {props.container.renderedBar.frames.map((frame) => {
          const backgroundColor =
            getFrameBackgroundColor(
              props.isEditMode,
              props.tab.activeFrame,
              props.container.position,
              frame.index,
            ) ?? props.backgroundColor;

          const updateFrame = (value: string) => {
            const nextTab = tabOperations.updateChordFrame(
              props.tab,
              props.container.originalBar.index,
              frame.index,
              value,
              props.container.inSection,
            );
            props.updateTab(nextTab);
          };

          return (
            <ChordFrame
              backgroundColor={backgroundColor}
              canUpdate={props.canUpdate}
              isEditMode={props.isEditMode}
              isFirstFrame={frame.index === 0}
              key={frame.index}
              strumming={strummingPattern?.frames[frame.index]?.value ?? ''}
              update={updateFrame}
              value={frame.value}
              width={`${framesWidth}%`}
            />
          );
        })}
      </div>
    </div>
  );
};
