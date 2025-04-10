import { activeColor, NonReferenceBarType } from '../../constants';
import { barOperations, sectionOperations, tabOperations } from '../../operations';
import { ActiveSlot, Section, Tab } from '../../types';

export type BarComponentBaseProps = {
  activeSlot: ActiveSlot | undefined;
  backgroundColor: string;
  canUpdate: boolean;
  isEditMode: boolean;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const addBar = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  barIndex: number,
  type: NonReferenceBarType,
  inSection?: Section,
) => {
  const nextTab = tabOperations.addBar(tab, barIndex, type, inSection);
  updateTab(nextTab);
};

export const copyBarEnd = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  destinationIndex: number,
  inSection?: Section,
) => {
  const nextTab = tabOperations.copyBarEnd(tab, destinationIndex, inSection);
  updateTab(nextTab);
};

export const getSlotBackgroundColor = (
  activeSlot: ActiveSlot | undefined,
  position: number,
  slotIndex: number,
) => {
  return activeSlot?.barContainer.position === position && activeSlot?.slotIndex === slotIndex
    ? activeColor
    : undefined;
};

export const moveBarEnd = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  destinationIndex: number,
  inSection?: Section,
) => {
  const nextTab = tabOperations.moveBarEnd(tab, destinationIndex, inSection);
  updateTab(nextTab);
};

export const getPositionOperationConditions = (
  tab: Tab,
  barIndex: number,
  inSection: Section | undefined,
) => {
  const positionOperation = tab.copying || tab.moving;
  const positionOperationApplicable =
    (tab.copying && sectionOperations.isOperationInSection(tab.copying, inSection)) ||
    (tab.moving && sectionOperations.isOperationInSection(tab.moving, inSection));

  const isPositionSource =
    positionOperationApplicable &&
    (tab.copying?.startIndex === barIndex || tab.moving?.startIndex === barIndex);

  const isValidPositionTarget =
    !tab.moving || barOperations.canMoveBarToPosition(tab.moving.startIndex, barIndex);

  return {
    positionOperation: !!positionOperation,
    positionOperationApplicable: !!positionOperationApplicable,
    isPositionSource: !!isPositionSource,
    isValidPositionTarget: !!isValidPositionTarget,
  };
};
