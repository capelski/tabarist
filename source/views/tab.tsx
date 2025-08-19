import React, { RefObject, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { BeatEngine } from '../classes';
import {
  BarGroup,
  CenteredMessage,
  getYoutubeId,
  TabDetails,
  TabFooter,
  TabHeader,
} from '../components';
import { barsToBarContainers } from '../operations';
import { starredTabRepository, tabRepository } from '../repositories';
import { ActionType, StateProvider } from '../state';
import { Tab } from '../types';
import { MetaTags } from './common/meta-tags';
import { NotFound } from './not-found';

export type TabViewProps = {
  scrollView: RefObject<HTMLDivElement>;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const { dispatch, state } = useContext(StateProvider);
  const { tabId } = useParams();

  // Fetch the tab document if a tabId is provided and the corresponding tab is not loaded
  useEffect(() => {
    if (tabId && state.tab.document?.id !== tabId) {
      setLoading(true);

      tabRepository
        .getById(tabId)
        .then((nextTab) => {
          if (nextTab) {
            dispatch({ type: ActionType.setTab, tab: nextTab });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tabId]);

  useEffect(() => {
    if (state.tab.document && state.user.document && state.tab.isStarred === undefined) {
      starredTabRepository
        .getOne(state.user.document.uid, state.tab.document.id)
        .then((starredTab) => {
          dispatch({ type: ActionType.setStarredTab, starredTab });
          if (starredTab && starredTab.title !== state.tab.document!.title) {
            // If the tab title has changed after it was starred, update the starred title
            starredTab.title = state.tab.document!.title;
            starredTabRepository.update(starredTab);
          }
        })
        .catch((error) => {
          console.error(error);
          dispatch({ type: ActionType.setStarredTab, starredTab: undefined });
        });
    }
  }, [state.tab.document, state.tab.isStarred, state.user.document]);

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

  if (loading) {
    return <CenteredMessage>Loading...</CenteredMessage>;
  }

  if (!state.tab.document) {
    return <NotFound />;
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
        starredTabId={state.tab.starredTabId}
        subscription={state.user.stripeSubscription}
        tab={state.tab.document}
        updateTab={updateTab}
        user={state.user.document}
        youtubeVideoId={youtubeVideoId}
      />
    </div>
  );
};
