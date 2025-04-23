import { activeColor, NonReferenceBarType } from '../../constants';
import { barOperations, tabOperations } from '../../operations';
import { ActiveSlot, SectionBar, Tab } from '../../types';

export type BarComponentBaseProps = {
  activeSlot: ActiveSlot | undefined;
  isEditMode: boolean;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const addBar = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  barIndex: number,
  type: NonReferenceBarType,
  parentSection?: SectionBar,
) => {
  const nextTab = tabOperations.addBar(tab, barIndex, type, parentSection);
  updateTab(nextTab);
};

export const copyBarEnd = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  destinationIndex: number,
  parentSection?: SectionBar,
) => {
  const nextTab = tabOperations.copyBarEnd(tab, destinationIndex, parentSection);
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
  parentSection?: SectionBar,
) => {
  const nextTab = tabOperations.moveBarEnd(tab, destinationIndex, parentSection);
  updateTab(nextTab);
};

export const getPositionOperationConditions = (
  tab: Tab,
  barIndex: number,
  parentSection: SectionBar | undefined,
) => {
  const positionOperation = tab.copying || tab.moving;
  const positionOperationApplicable =
    (tab.copying && barOperations.isOperationInSection(tab.copying, parentSection)) ||
    (tab.moving && barOperations.isOperationInSection(tab.moving, parentSection));

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
