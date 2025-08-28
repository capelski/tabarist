import { BarType, ContainerType } from '../constants';
import { tabOperations } from '../operations';
import { ActiveSlot, BarContainer, Tab } from '../types';
import { ActionType } from './action-type';
import { AppAction } from './app-action';
import { AppState } from './app-state';

const clearTabState = (tabState: AppState['tab'], tab: Tab | undefined): AppState['tab'] => {
  return {
    ...tabState,
    activeSlot: undefined,
    document: tab,
    isDirty: undefined,
    isDraft: undefined,
    loading: undefined,
    originalDocument: tab && JSON.stringify(tab),
  };
};

const getActiveSlot = (
  barContainers: BarContainer[],
  startingPosition: number,
  repeats?: number,
): ActiveSlot | undefined => {
  const startIndex = barContainers.findIndex((x) => x.position === startingPosition);
  if (startIndex === -1) {
    return undefined;
  }
  return barContainers.slice(startIndex).reduce<ActiveSlot | undefined>((reduced, barContainer) => {
    return (
      reduced ||
      (barContainer.position !== undefined
        ? {
            barContainer: barContainer as BarContainer<ContainerType.chord | ContainerType.picking>,
            repeats: repeats ?? barContainer.repeatsValue ?? 0,
            slotIndex: 0,
          }
        : undefined)
    );
  }, undefined);
};

const getNextActiveSlot = (
  activeSlot: ActiveSlot | undefined,
  barContainers: BarContainer[],
): ActiveSlot | undefined => {
  if (activeSlot === undefined) {
    return getActiveSlot(barContainers, 0);
  }

  const { isLastInSectionBar, parentSection, position, firstSectionBarPosition, renderedBar } =
    activeSlot.barContainer;

  const slotsLength =
    renderedBar.type === BarType.chord ? renderedBar.slots.length : renderedBar.chordSupport.length;

  const isLastSlot = activeSlot.slotIndex === slotsLength - 1;
  if (!isLastSlot) {
    return {
      ...activeSlot,
      slotIndex: activeSlot.slotIndex + 1,
    };
  }

  const hasRemainingRepeats = activeSlot.repeats > 1;
  const mustRepeat = hasRemainingRepeats && (!parentSection || isLastInSectionBar);
  if (mustRepeat) {
    const repeatPosition = firstSectionBarPosition ?? position;
    return getActiveSlot(barContainers, repeatPosition, activeSlot.repeats - 1);
  }

  const nextRepeats =
    parentSection && (!isLastInSectionBar || hasRemainingRepeats) ? activeSlot.repeats : undefined;
  return getActiveSlot(barContainers, position + 1, nextRepeats);
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  if (action.type === ActionType.activeSlotClear) {
    return {
      ...state,
      tab: {
        ...state.tab,
        activeSlot: undefined,
      },
    };
  }

  if (action.type === ActionType.activeSlotUpdate) {
    return {
      ...state,
      tab: {
        ...state.tab,
        activeSlot: getNextActiveSlot(state.tab.activeSlot, action.barContainers),
      },
    };
  }

  if (action.type === ActionType.createTab) {
    const document = tabOperations.create(state.user.document?.uid || 'NA');
    return {
      ...state,
      tab: {
        document,
        isDraft: true,
        isEditMode: action.isEditMode,
        originalDocument: JSON.stringify(document),
      },
    };
  }

  if (action.type === ActionType.deleteCancel) {
    return {
      ...state,
      deletingTab: undefined,
    };
  }

  if (action.type === ActionType.deleteConfirm) {
    return {
      ...state,
      deletingTab: undefined,
      tab: {
        document: undefined,
      },
    };
  }

  if (action.type === ActionType.deletePrompt) {
    return { ...state, deletingTab: action.tab };
  }

  if (action.type === ActionType.discardChangesCancel) {
    return {
      ...state,
      tab: {
        ...state.tab,
        discardChangesModal: undefined,
      },
    };
  }

  if (action.type === ActionType.discardChangesPrompt) {
    return {
      ...state,
      tab: {
        ...state.tab,
        discardChangesModal: true,
      },
    };
  }

  if (action.type === ActionType.editModeCancel) {
    return {
      ...state,
      tab: {
        ...state.tab,
        discardChangesModal: undefined,
        document: state.tab.originalDocument && JSON.parse(state.tab.originalDocument),
        isDirty: false,
        isEditMode: false,
      },
    };
  }

  if (action.type === ActionType.editModeEnter) {
    return {
      ...state,
      tab: {
        ...state.tab,
        activeSlot: undefined,
        isEditMode: true,
      },
    };
  }

  if (action.type === ActionType.editModeSave) {
    return {
      ...state,
      tab: clearTabState(state.tab, action.tab),
    };
  }

  if (action.type === ActionType.fetchStarredTabsEnd) {
    return {
      ...state,
      starredTabs: {
        ...state.starredTabs,
        data: action.response,
        loading: undefined,
      },
    };
  }

  if (action.type === ActionType.fetchStarredTabsStart) {
    return {
      ...state,
      starredTabs: {
        loading: true,
        params: action.params,
      },
    };
  }

  if (action.type === ActionType.fetchTabDetailsEnd) {
    return {
      ...state,
      tab: clearTabState({ ...state.tab, starredTabId: action.starredTabId }, action.tab),
    };
  }

  if (action.type === ActionType.fetchTabDetailsStart) {
    return {
      ...state,
      tab: {
        ...state.tab,
        loading: true,
      },
    };
  }

  if (action.type === ActionType.fetchTabsEnd) {
    return {
      ...state,
      [action.route]: {
        ...state[action.route],
        data: action.response,
        loading: undefined,
      },
    };
  }

  if (action.type === ActionType.fetchTabsStart) {
    return {
      ...state,
      deletingTab: undefined, // Might come from a tab deletion modal
      [action.route]: {
        loading: true,
        params: action.params,
      },
    };
  }

  if (action.type === ActionType.loaderDisplay) {
    return {
      ...state,
      loading: true,
    };
  }

  if (action.type === ActionType.loaderHide) {
    return {
      ...state,
      loading: undefined,
    };
  }

  if (action.type === ActionType.positionOperationCancel) {
    return {
      ...state,
      tab: {
        ...state.tab,
        positionOperation: undefined,
      },
    };
  }

  if (action.type === ActionType.positionOperationEnd) {
    if (!state.tab.document) {
      return {
        ...state,
        tab: {
          ...state.tab,
          positionOperation: undefined,
        },
      };
    }

    const nextDocument =
      state.tab.positionOperation?.type === 'copying'
        ? tabOperations.copyBar(
            state.tab.document,
            action.endIndex,
            state.tab.positionOperation,
            action.parentSection,
          )
        : state.tab.positionOperation?.type === 'moving'
        ? tabOperations.moveBar(
            state.tab.document,
            action.endIndex,
            state.tab.positionOperation,
            action.parentSection,
          )
        : state.tab.document;

    return {
      ...state,
      tab: {
        ...state.tab,
        document: nextDocument,
        isDirty: JSON.stringify(nextDocument) !== state.tab.originalDocument,
        positionOperation: undefined,
      },
    };
  }

  if (action.type === ActionType.positionOperationStart) {
    return {
      ...state,
      tab: {
        ...state.tab,
        positionOperation: action.positionOperation,
      },
    };
  }

  if (action.type === ActionType.setStarredTabId) {
    return {
      ...state,
      tab: {
        ...state.tab,
        starredTabId: action.starredTabId,
      },
    };
  }

  if (action.type === ActionType.setUser) {
    return {
      ...state,
      user: {
        document: action.user,
        stripeSubscription: action.subscription,
      },
    };
  }

  if (action.type === ActionType.signInFinish) {
    return {
      ...state,
      signInModal: undefined,
    };
  }

  if (action.type === ActionType.signInStart) {
    return {
      ...state,
      signInModal: {
        message: action.message,
      },
    };
  }

  if (action.type === ActionType.updateTab) {
    return {
      ...state,
      tab: {
        ...state.tab,
        isDirty: JSON.stringify(action.tab) !== state.tab.originalDocument,
        document: action.tab,
      },
    };
  }

  if (action.type === ActionType.upgradeCancel) {
    return {
      ...state,
      upgradeModal: undefined,
    };
  }

  if (action.type === ActionType.upgradeStart) {
    return {
      ...state,
      upgradeModal: {
        message: action.message,
      },
    };
  }

  return state;
};
