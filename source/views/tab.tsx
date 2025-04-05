import { User } from 'firebase/auth';
import React, { RefObject, useContext, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { BarGroup, RhythmList, SectionList, TabDetails, TabHeader, TabPlay } from '../components';
import { barsToBarContainers } from '../operations';
import { tabRepository } from '../repositories';
import { ActionType, DispatchProvider } from '../state';
import { ActiveSlot, Tab } from '../types';
import { MetaTags } from './common/meta-tags';

export type TabViewProps = {
  activeSlot: ActiveSlot | undefined;
  isDirty?: boolean;
  isDraft?: boolean;
  isEditMode: boolean;
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
          dispatch({ type: ActionType.setTab, document: nextTab });
        }
      });
    }
  }, [tabId]);

  const barContainers = useMemo(() => {
    if (props.tab?.bars) {
      return barsToBarContainers(props.tab, props.tab.bars);
    }

    return [];
  }, [props.tab?.bars, props.tab?.rhythms, props.tab?.sections]);

  if (!props.tab) {
    return <h3>Couldn't load tab</h3>;
  }

  const updateTab = (nextTab: Tab) => {
    dispatch({ type: ActionType.updateTab, payload: nextTab });
  };

  return (
    <div className="tab">
      <MetaTags description={`Guitar tab for ${props.tab.title}`} title={props.tab.title} />

      <TabHeader
        isDirty={props.isDirty}
        isDraft={props.isDraft}
        isEditMode={props.isEditMode}
        playTimeoutRef={playTimeoutRef}
        tab={props.tab}
        updateTab={updateTab}
        user={props.user}
      />

      <TabDetails isEditMode={props.isEditMode} tab={props.tab} updateTab={updateTab} />

      {props.isEditMode && (
        <React.Fragment>
          <SectionList tab={props.tab} updateTab={updateTab} />
          <RhythmList tab={props.tab} updateTab={updateTab} />
        </React.Fragment>
      )}

      <BarGroup
        activeSlot={props.activeSlot}
        barContainers={barContainers}
        barsNumber={props.tab.bars.length}
        inSection={undefined}
        isEditMode={props.isEditMode}
        scrollView={props.scrollView}
        tab={props.tab}
        updateTab={updateTab}
      />

      <TabPlay
        activeSlot={props.activeSlot}
        barContainers={barContainers}
        isEditMode={props.isEditMode}
        playTimeoutRef={playTimeoutRef}
        tab={props.tab}
        updateTab={updateTab}
      />
    </div>
  );
};
