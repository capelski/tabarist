import { activeColor, NonReferenceBarType } from '../../constants';
import { barOperations, tabOperations } from '../../operations';
import { ActiveSlot, PositionOperation, SectionBar, Tab } from '../../types';

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

export const getSlotBackgroundColor = (
  activeSlot: ActiveSlot | undefined,
  position: number,
  slotIndex: number,
) => {
  return activeSlot?.barContainer.position === position && activeSlot?.slotIndex === slotIndex
    ? activeColor
    : undefined;
};

export const getPositionOperationConditions = (
  copying: PositionOperation | undefined,
  moving: PositionOperation | undefined,
  barIndex: number,
  parentSection: SectionBar | undefined,
) => {
  const positionOperation = copying || moving;
  const positionOperationApplicable =
    (copying && barOperations.isOperationInSection(copying, parentSection)) ||
    (moving && barOperations.isOperationInSection(moving, parentSection));

  const isPositionSource =
    positionOperationApplicable &&
    (copying?.startIndex === barIndex || moving?.startIndex === barIndex);

  const isValidPositionTarget =
    !moving || barOperations.canMoveBarToPosition(moving.startIndex, barIndex);

  return {
    positionOperation: !!positionOperation,
    positionOperationApplicable: !!positionOperationApplicable,
    isPositionSource: !!isPositionSource,
    isValidPositionTarget: !!isValidPositionTarget,
  };
};
