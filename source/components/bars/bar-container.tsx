import React, { RefObject } from 'react';
import { ContainerType } from '../../constants';
import { ActiveSlot, BarContainer, PositionOperation, Tab } from '../../types';
import { BarRendered } from './bar-rendered';
import { SectionHead } from './section-head';
import { SectionTail } from './section-tail';

export type BarContainerComponentProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  copying: PositionOperation | undefined;
  isEditMode: boolean | undefined;
  moving: PositionOperation | undefined;
  scrollView: RefObject<HTMLDivElement> | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarContainerComponent: React.FC<BarContainerComponentProps> = (props) => {
  return props.container.type === ContainerType.sectionTail ? (
    <SectionTail {...props} />
  ) : props.container.isParent ? (
    <SectionHead {...props} />
  ) : (
    <BarRendered {...props} />
  );
};
