import { BarType, ContainerType } from '../constants';
import { getTabRelativeUrl, tabOperations } from '../operations';
import { ActiveSlot, BarContainer } from '../types';
import { ActionType } from './action-type';
import { AppAction } from './app-action';
import { AppState } from './app-state';

const getDiscardPromptState = (state: AppState, navigate: AppState['navigate']): AppState => ({
  ...state,
  navigate,
  tab: {
    ...state.tab,
    discardChangesModal: true,
  },
});

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
            repeats: repeats ?? barContainer.repeats ?? 0,
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

  if (action.type === ActionType.authStateChanged) {
    return {
      ...state,
      user: {
        document: action.user,
      },
    };
  }

  if (action.type === ActionType.clearNavigation) {
    return {
      ...state,
      navigate:
        state.navigate?.to && state.navigate?.to.length > 1
          ? { to: state.navigate?.to.slice(1) }
          : undefined,
    };
  }

  if (action.type === ActionType.createTab) {
    if (!state.user.document) {
      return {
        ...state,
        signInModal: { message: 'Sign in to start creating tabs' },
      };
    }

    if (state.tab.isDirty) {
      return getDiscardPromptState(state, undefined);
    }

    const document = tabOperations.create(state.user.document.uid);
    return {
      ...state,
      navigate: { to: [getTabRelativeUrl(document.id), getTabRelativeUrl(document.id, true)] },
      tab: {
        document,
        isDraft: true,
        isEditMode: true,
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
      navigate: action.navigate,
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

  if (action.type === ActionType.discardChangesConfirm) {
    return {
      ...state,
      navigate: action.navigate,
      tab: {
        ...state.tab,
        copying: undefined,
        discardChangesModal: undefined,
        document: JSON.parse(state.tab.originalDocument!),
        isDirty: false,
        isEditMode: undefined,
        moving: undefined,
      },
    };
  }

  if (action.type === ActionType.discardChangesPrompt) {
    return getDiscardPromptState(state, action.navigate);
  }

  if (action.type === ActionType.enterEditMode) {
    return {
      ...state,
      navigate: action.navigate,
      tab: {
        ...state.tab,
        activeSlot: undefined,
        isEditMode: true,
      },
    };
  }

  if (action.type === ActionType.fetchStarredTabsEnd) {
    return {
      ...state,
      starredTabs: {
        ...state.starredTabs,
        data: action.response,
        loading: undefined,
        skipUrlUpdate: undefined,
      },
      navigate: action.navigate,
    };
  }

  if (action.type === ActionType.fetchStarredTabsStart) {
    return {
      ...state,
      starredTabs: {
        ...state.starredTabs,
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
        skipUrlUpdate: undefined,
      },
      navigate: action.navigate,
    };
  }

  if (action.type === ActionType.fetchTabsStart) {
    return {
      ...state,
      deletingTab: undefined, // Might come from a tab deletion modal
      [action.route]: {
        ...state[action.route],
        loading: true,
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
      loading: true,
    };
  }

  if (action.type === ActionType.positionOperationCancel) {
    return {
      ...state,
      tab: {
        ...state.tab,
        copying: undefined,
        moving: undefined,
      },
    };
  }

  if (action.type === ActionType.positionOperationEnd) {
    if (!state.tab.document) {
      return {
        ...state,
        tab: {
          ...state.tab,
          copying: undefined,
          moving: undefined,
        },
      };
    }

    return {
      ...state,
      tab: {
        ...state.tab,
        copying: undefined,
        document: state.tab.copying
          ? tabOperations.copyBar(
              state.tab.document,
              action.endIndex,
              state.tab.copying,
              action.parentSection,
            )
          : state.tab.moving
          ? tabOperations.moveBar(
              state.tab.document,
              action.endIndex,
              state.tab.moving,
              action.parentSection,
            )
          : state.tab.document,
        moving: undefined,
      },
    };
  }

  if (action.type === ActionType.positionOperationStart) {
    return {
      ...state,
      tab: {
        ...state.tab,
        [action.operation]: action.positionOperation,
      },
    };
  }

  if (action.type === ActionType.searchParamsReady) {
    return {
      ...state,
      searchParamsReady: true,
    };
  }

  if (action.type === ActionType.setStarredListParameters) {
    return {
      ...state,
      starredTabs: {
        // Clearing data will trigger a fetch request
        params: action.params,
        skipUrlUpdate: action.skipUrlUpdate,
      },
    };
  }

  if (action.type === ActionType.setStarredTab) {
    return {
      ...state,
      starredTabs: action.starredTab
        ? state.starredTabs
        : {
            ...state.starredTabs,
            // Removing the starred tab might require reloading the list of starred tabs
            data: undefined,
          },
      tab: {
        ...state.tab,
        isStarred: action.starredTab,
      },
    };
  }

  if (action.type === ActionType.setStripeSubscription) {
    return {
      ...state,
      user: {
        ...state.user,
        stripeSubscription: action.subscription,
      },
    };
  }

  if (action.type === ActionType.setTab) {
    return {
      ...state,
      navigate: action.navigate,
      tab: {
        ...state.tab,
        document: action.tab,
        isDirty: undefined,
        isDraft: undefined,
        isStarred: undefined,
        originalDocument: JSON.stringify(action.tab),
      },
    };
  }

  if (action.type === ActionType.setTabListParams) {
    return {
      ...state,
      [action.route]: {
        // Clearing data will trigger a fetch request
        params: action.params,
        skipUrlUpdate: action.skipUrlUpdate,
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
      upgradeModal: true,
    };
  }

  return state;
};
