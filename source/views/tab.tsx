import React, { RefObject, useContext, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { BeatEngine } from '../classes';
import { BarGroup, getYoutubeId, TabDetails, TabFooter, TabHeader } from '../components';
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

  // The beat engine must be available to both tab header and tab footer
  const beatEngine = useRef(new BeatEngine());

  const barContainers = useMemo(() => {
    if (state.tab.document?.bars) {
      const barContainers = barsToBarContainers(
        state.tab.document.bars,
        state.tab.isEditMode,
        state.tab.positionOperation,
      );
      return barContainers;
    }

    return [];
  }, [
    state.tab.isEditMode,
    state.tab.document?.bars,
    state.tab.positionOperation,
    state.tab.document?.rhythms,
  ]);

  if (!state.tab.document) {
    return <h3>Couldn't load tab</h3>;
  }

  const updateTab = (nextTab: Tab) => {
    dispatch({ type: ActionType.updateTab, tab: nextTab });
  };

  const youtubeVideoId = getYoutubeId(state.tab.document.backingTrack);

  return (
    <div className="tab">
      <MetaTags
        description={`Guitar tab for ${state.tab.document.title}`}
        title={state.tab.document.title}
      />

      <TabHeader
        beatEngine={beatEngine.current}
        deletingTab={state.deletingTab}
        isDirty={state.tab.isDirty}
        isDraft={state.tab.isDraft}
        isEditMode={state.tab.isEditMode}
        tab={state.tab.document}
        updateTab={updateTab}
        user={state.user.document}
      />

      <BarGroup
        activeSlot={state.tab.activeSlot}
        barContainers={barContainers}
        barsNumber={state.tab.document.bars.length}
        isEditMode={state.tab.isEditMode}
        positionOperation={state.tab.positionOperation}
        scrollView={props.scrollView}
        tab={state.tab.document}
        updateTab={updateTab}
      />

      <TabDetails
        isEditMode={state.tab.isEditMode}
        tab={state.tab.document}
        updateTab={updateTab}
        youtubeVideoId={youtubeVideoId}
      />

      <TabFooter
        beatEngine={beatEngine.current}
        activeSlot={state.tab.activeSlot}
        barContainers={barContainers}
        isDraft={state.tab.isDraft}
        isEditMode={state.tab.isEditMode}
        isStarred={state.tab.isStarred}
        subscription={state.user.stripeSubscription}
        tab={state.tab.document}
        updateTab={updateTab}
        user={state.user.document}
        youtubeVideoId={youtubeVideoId}
      />
    </div>
  );
};
