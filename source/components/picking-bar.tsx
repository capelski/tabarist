import React from 'react';
import { tabOperations } from '../operations';
import { BarContainer, PickingBar } from '../types';
import { BarComponentBaseProps, getFrameBackgroundColor } from './commons';
import { PickingFrameComponent } from './picking-frame';

export type PickingBarComponentProps = BarComponentBaseProps & {
  container: BarContainer<PickingBar>;
};

export const PickingBarComponent: React.FC<PickingBarComponentProps> = (props) => {
  const framesWidth = Math.floor(10000 / props.container.renderedBar.frames.length) / 100;
  const displayChordSupport = props.container.renderedBar.frames.some(
    (frame) => frame.chordSupport,
  );

  return (
    <div
      className="picking-bar"
      style={{
        borderLeft: '1px solid black',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {props.container.renderedBar.frames.map((frame) => {
        const backgroundColor =
          getFrameBackgroundColor(props.tab.activeFrame, props.container.position, frame.index) ??
          props.backgroundColor;

        const updateFrame = (stringIndex: number, value: string) => {
          const nextTab = tabOperations.updatePickingFrame(
            props.tab,
            props.container.originalBar!.index,
            frame.index,
            stringIndex,
            value,
            props.container.inSection,
          );
          props.updateTab(nextTab);
        };

        return (
          <PickingFrameComponent
            backgroundColor={backgroundColor}
            canUpdate={props.canUpdate}
            displayChordSupport={displayChordSupport}
            frame={frame}
            isEditMode={props.isEditMode}
            isFirstFrame={frame.index === 0}
            key={frame.index}
            update={updateFrame}
            width={`${framesWidth}%`}
          />
        );
      })}
    </div>
  );
};
