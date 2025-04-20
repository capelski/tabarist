import { User } from 'firebase/auth';
import React, { RefObject, useContext, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { BarGroup, RhythmList, TabDetails, TabFooter, TabHeader } from '../components';
import { barsToBarContainers } from '../operations';
import { tabRepository, userRepository } from '../repositories';
import { ActionType, DispatchProvider } from '../state';
import { ActiveSlot, Tab } from '../types';
import { MetaTags } from './common/meta-tags';

export type TabViewProps = {
  activeSlot: ActiveSlot | undefined;
  deletingTab?: Tab;
  isDirty?: boolean;
  isDraft?: boolean;
  isEditMode: boolean;
  isStarred?: boolean;
  scrollView: RefObject<HTMLDivElement>;
  tab?: Tab;
  user: User | null;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  // When entering edit mode from play mode we need to clear the next timeout
  const playTimeoutRef = useRef(0);

  const dispatch = useContext(DispatchProvider);
  const { tabId } = useParams();

  // Fetch the tab document if a tabId is provided and the corresponding tab is not loaded
  useEffect(() => {
    if (tabId && props.tab?.id !== tabId) {
      tabRepository.getById(tabId).then((nextTab) => {
        if (nextTab) {
          dispatch({ type: ActionType.setTab, tab: nextTab });
        }
      });
    }
  }, [tabId]);

  useEffect(() => {
    const { tab, user } = props;
    if (tab && user && props.isStarred === undefined) {
      userRepository.getStarredTab(user.uid, tab.id).then((starredTab) => {
        dispatch({ type: ActionType.setStarredTab, starredTab: !!starredTab });
        if (starredTab && starredTab.title !== tab.title) {
          // If the tab title has changed after it was starred, update the starred title
          userRepository.setStarredTab(user.uid, tab);
        }
      });
    }
  }, [props.isStarred, props.tab, props.user]);

  const barContainers = useMemo(() => {
    if (props.tab?.bars) {
      return barsToBarContainers(props.tab.bars, props.isEditMode);
    }

    return [];
  }, [props.isEditMode, props.tab?.bars, props.tab?.rhythms]);

  if (!props.tab) {
    return <h3>Couldn't load tab</h3>;
  }

  const updateTab = (nextTab: Tab) => {
    dispatch({ type: ActionType.updateTab, tab: nextTab });
  };

  return (
    <div className="tab">
      <MetaTags description={`Guitar tab for ${props.tab.title}`} title={props.tab.title} />

      <TabHeader
        deletingTab={props.deletingTab}
        isDirty={props.isDirty}
        isDraft={props.isDraft}
        isEditMode={props.isEditMode}
        playTimeoutRef={playTimeoutRef}
        tab={props.tab}
        updateTab={updateTab}
        user={props.user}
      />

      <TabDetails isEditMode={props.isEditMode} tab={props.tab} updateTab={updateTab} />

      <BarGroup
        activeSlot={props.activeSlot}
        barContainers={barContainers}
        barsNumber={props.tab.bars.length}
        isEditMode={props.isEditMode}
        scrollView={props.scrollView}
        tab={props.tab}
        updateTab={updateTab}
      />

      {props.isEditMode && (
        <React.Fragment>
          <RhythmList tab={props.tab} updateTab={updateTab} />
        </React.Fragment>
      )}

      <TabFooter
        activeSlot={props.activeSlot}
        barContainers={barContainers}
        isDraft={props.isDraft}
        isEditMode={props.isEditMode}
        isStarred={props.isStarred}
        playTimeoutRef={playTimeoutRef}
        tab={props.tab}
        updateTab={updateTab}
        user={props.user}
      />
    </div>
  );
};
