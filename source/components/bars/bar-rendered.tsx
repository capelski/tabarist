import React, { RefObject, useEffect, useRef } from 'react';
import { BarType, ContainerType } from '../../constants';
import { ActiveSlot, BarContainer, PositionOperation, Tab } from '../../types';
import { BarCore } from './bar-core';
import { BarComponentBaseProps } from './bar-handlers';
import { ChordBarComponent } from './chord-bar';
import { PickingBarComponent } from './picking-bar';

export type BarRenderedProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  copying: PositionOperation | undefined;
  isEditMode: boolean | undefined;
  moving: PositionOperation | undefined;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarRendered: React.FC<BarRenderedProps> = (props) => {
  const divRef = useRef<HTMLDivElement>(null);

  const barBaseProps: BarComponentBaseProps = {
    activeSlot: props.activeSlot,
    isEditMode: props.isEditMode,
    tab: props.tab,
    updateTab: props.updateTab,
  };

  useEffect(() => {
    if (
      props.activeSlot &&
      props.activeSlot?.barContainer.position === props.container.position &&
      props.scrollView?.current &&
      divRef.current
    ) {
      props.scrollView.current.scrollTo({
        top: divRef.current.offsetTop - props.scrollView.current.clientHeight * 0.4,
        behavior: 'smooth',
      });
    }
  }, [props.activeSlot]);

  return (
    props.container.display && (
      <BarCore {...props} divRef={divRef}>
        {!('renderedBar' in props.container) ? (
          'Unknown bar'
        ) : props.container.renderedBar.type === BarType.chord ? (
          <ChordBarComponent
            {...barBaseProps}
            container={props.container as BarContainer<ContainerType.chord>}
          />
        ) : (
          <PickingBarComponent
            {...barBaseProps}
            container={props.container as BarContainer<ContainerType.picking>}
          />
        )}
      </BarCore>
    )
  );
};
