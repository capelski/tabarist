import React, { RefObject, useContext, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { BarGroup, TabDetails, TabFooter, TabHeader } from '../components';
import { barsToBarContainers } from '../operations';
import { tabRepository, userRepository } from '../repositories';
import { ActionType, StateProvider } from '../state';
import { Tab } from '../types';
import { MetaTags } from './common/meta-tags';

export type TabViewProps = {
  scrollView: RefObject<HTMLDivElement>;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  const { dispatch, state } = useContext(StateProvider);
  const { tabId } = useParams();

  // When entering edit mode from play mode we need to clear the next timeout
  const playTimeoutRef = useRef<number>();

  // Fetch the tab document if a tabId is provided and the corresponding tab is not loaded
  useEffect(() => {
    if (tabId && state.tab.document?.id !== tabId) {
      tabRepository.getById(tabId).then((nextTab) => {
        if (nextTab) {
          dispatch({ type: ActionType.setTab, tab: nextTab });
        }
      });
    }
  }, [tabId]);

  useEffect(() => {
    if (state.tab.document && state.user.document && state.tab.isStarred === undefined) {
      userRepository
        .getStarredTab(state.user.document.uid, state.tab.document.id)
        .then((starredTab) => {
          dispatch({ type: ActionType.setStarredTab, starredTab: !!starredTab });
          if (starredTab && starredTab.title !== state.tab.document!.title) {
            // If the tab title has changed after it was starred, update the starred title
            userRepository.setStarredTab(state.user.document!.uid, state.tab.document!);
          }
        })
        .catch((error) => {
          console.error(error);
          dispatch({ type: ActionType.setStarredTab, starredTab: false });
        });
    }
  }, [state.tab.isStarred, state.tab.document, state.user.document]);

  const barContainers = useMemo(() => {
    if (state.tab.document?.bars) {
      return barsToBarContainers(state.tab.document.bars, state.tab.isEditMode);
    }

    return [];
  }, [state.tab.isEditMode, state.tab.document?.bars, state.tab.document?.rhythms]);

  if (!state.tab.document) {
    return <h3>Couldn't load tab</h3>;
  }

  const updateTab = (nextTab: Tab) => {
    dispatch({ type: ActionType.updateTab, tab: nextTab });
  };

  return (
    <div className="tab">
      <MetaTags
        description={`Guitar tab for ${state.tab.document.title}`}
        title={state.tab.document.title}
      />

      <TabHeader
        deletingTab={state.deletingTab}
        isDirty={state.tab.isDirty}
        isDraft={state.tab.isDraft}
        isEditMode={state.tab.isEditMode}
        playTimeoutRef={playTimeoutRef}
        tab={state.tab.document}
        updateTab={updateTab}
        user={state.user.document}
      />

      <TabDetails
        isEditMode={state.tab.isEditMode}
        tab={state.tab.document}
        updateTab={updateTab}
      />

      <BarGroup
        activeSlot={state.tab.activeSlot}
        barContainers={barContainers}
        barsNumber={state.tab.document.bars.length}
        copying={state.tab.copying}
        isEditMode={state.tab.isEditMode}
        moving={state.tab.moving}
        scrollView={props.scrollView}
        tab={state.tab.document}
        updateTab={updateTab}
      />

      <TabFooter
        activeSlot={state.tab.activeSlot}
        barContainers={barContainers}
        isDraft={state.tab.isDraft}
        isEditMode={state.tab.isEditMode}
        isStarred={state.tab.isStarred}
        playTimeoutRef={playTimeoutRef}
        tab={state.tab.document}
        updateTab={updateTab}
        user={state.user.document}
      />
    </div>
  );
};
