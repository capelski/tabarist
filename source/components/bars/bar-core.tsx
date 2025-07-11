import React, { PropsWithChildren, RefObject } from 'react';
import { ActiveSlot, BarContainer, PositionOperation, Tab } from '../../types';
import { BarHeader } from './bar-header';

export type BarCoreProps = PropsWithChildren<{
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  divRef?: RefObject<HTMLDivElement>;
  isEditMode: boolean | undefined;
  positionOperation: PositionOperation | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
}>;

export const BarCore: React.FC<BarCoreProps> = (props) => {
  return (
    <div
      className="bar-container"
      ref={props.divRef}
      style={{
        alignSelf: 'stretch', // So chord bars next to picking bars have the same height
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        marginBottom: 8,
        width: props.container.width,
        maxWidth: '100%',
      }}
    >
      <div className="bar-content" style={{ display: 'flex', flexGrow: 1, flexDirection: 'row' }}>
        <div
          className="bar-core"
          style={{
            borderLeft: '1px solid black',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'end',
            maxWidth: '100%',
            padding: props.isEditMode ? '0 2px' : undefined,
          }}
        >
          <BarHeader {...props} />

          {props.children}
        </div>
      </div>
    </div>
  );
};
