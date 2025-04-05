import { BarType } from '../constants';
import { getTabRelativeUrl, tabOperations } from '../operations';
import { ActiveSlot, BarContainer, ChordBar, PickingBar } from '../types';
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
  return barContainers
    .slice(startingPosition)
    .reduce<ActiveSlot | undefined>((reduced, barContainer) => {
      return (
        reduced ||
        (barContainer.renderedBar
          ? {
              barContainer: barContainer as BarContainer<ChordBar | PickingBar>,
              repeats: repeats ?? barContainer.originalBar.repeats ?? 0,
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

  const { inSectionBar, isLastInSectionBar, position, positionOfFirstBar, renderedBar } =
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
  const mustRepeat = hasRemainingRepeats && (!inSectionBar || isLastInSectionBar);
  if (mustRepeat) {
    const repeatPosition = positionOfFirstBar ?? position;
    return getActiveSlot(barContainers, repeatPosition, activeSlot.repeats - 1);
  }

  const nextRepeats =
    inSectionBar && (!isLastInSectionBar || hasRemainingRepeats) ? activeSlot.repeats : undefined;
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
        activeSlot: getNextActiveSlot(state.tab.activeSlot, action.payload),
      },
    };
  }

  if (action.type === ActionType.authStateChanged) {
    return {
      ...state,
      user: {
        document: action.payload,
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
        signInDialog: { message: 'Sign in to start creating tabs' },
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
        discardChangesModal: undefined,
        document: JSON.parse(state.tab.originalDocument!),
        isDirty: false,
        isEditMode: undefined,
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

  if (action.type === ActionType.setTab) {
    return {
      ...state,
      navigate: action.navigate,
      tab: {
        ...state.tab,
        document: action.document,
        isDirty: undefined,
        isDraft: undefined,
        originalDocument: JSON.stringify(action.document),
      },
    };
  }

  if (action.type === ActionType.setStripeSubscription) {
    return {
      ...state,
      user: {
        ...state.user,
        stripeSubscription: action.payload,
      },
    };
  }

  if (action.type === ActionType.signInFinish) {
    return {
      ...state,
      signInDialog: undefined,
    };
  }

  if (action.type === ActionType.signInStart) {
    return {
      ...state,
      signInDialog: {
        message: action.payload,
      },
    };
  }

  if (action.type === ActionType.updateTab) {
    return {
      ...state,
      tab: {
        ...state.tab,
        isDirty: JSON.stringify(action.payload) !== state.tab.originalDocument,
        document: action.payload,
      },
    };
  }

  return state;
};
