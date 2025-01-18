import { BarType } from '../constants';
import { PositionOperation, Section, Tab } from '../types';

export const sectionOperations = {
  canDelete: (tab: Tab, sectionIndex: number) => {
    return !tab.bars.some(
      (bar) => bar.type === BarType.section && bar.sectionIndex === sectionIndex,
    );
  },

  create: (index: number): Section => {
    return {
      bars: [],
      index,
      name: 'Unnamed section',
    };
  },

  isOperationInSection: (positionOperation: PositionOperation, inSection: Section | undefined) => {
    return positionOperation.sectionIndex === inSection?.index;
  },
};
