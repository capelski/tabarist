import React, { RefObject, useContext, useMemo, useRef } from 'react';
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
import { ActionType, StateProvider } from '../state';
import { Tab } from '../types';
import { MetaTags } from './common/meta-tags';
import { NotFound } from './not-found';

export type TabViewProps = {
  scrollView: RefObject<HTMLDivElement>;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  const { dispatch, state } = useContext(StateProvider);

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

  if (state.tab.loading) {
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
        isDirty={state.tab.isDirty}
        isDraft={state.tab.isDraft}
        isEditMode={state.tab.isEditMode}
        starredTabId={state.tab.starredTabId}
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
