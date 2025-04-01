import { User } from 'firebase/auth';
import React, { RefObject, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { BarGroup, RhythmList, SectionList, TabDetails, TabHeader, TabPlay } from '../components';
import { QueryParameters } from '../constants';
import { barsToBarContainers } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';
import { MetaTags } from './common/meta-tags';

export type TabViewProps = {
  existsInServer: boolean;
  isEditMode: boolean;
  promptDiscardChanges: () => void;
  saveEditChanges: () => void;
  scrollView: RefObject<HTMLDivElement>;
  tab?: Tab;
  updateTab: (tab: Tab, options?: { setExists?: boolean; setOriginal?: boolean }) => void;
  user: User | null;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  // When entering edit mode from play mode we need to clear the next timeout
  const playTimeoutRef = useRef(0);

  const [searchParams] = useSearchParams();
  const { tabId } = useParams();

  useEffect(() => {
    if (tabId && props.tab?.id !== tabId) {
      tabRepository.getById(tabId).then((nextTab) => {
        if (nextTab) {
          props.updateTab(nextTab, {
            setExists: true,
            setOriginal: searchParams.get(QueryParameters.editMode) === 'true',
          });
        }
      });
    }
  }, [tabId]);

  // Update edit mode upon browser back/forward navigation
  useEffect(() => {
    if (props.isEditMode && searchParams.get(QueryParameters.editMode) !== 'true') {
      props.promptDiscardChanges();
    } else if (
      !props.isEditMode &&
      searchParams.get(QueryParameters.editMode) === 'true' &&
      props.tab
    ) {
      props.updateTab(props.tab, { setOriginal: true });
    }
  }, [searchParams]);

  const barContainers = useMemo(() => {
    if (props.tab?.bars) {
      return barsToBarContainers(props.tab, props.tab.bars);
    }

    return [];
  }, [props.tab?.bars, props.tab?.rhythms, props.tab?.sections]);

  if (!props.tab) {
    return <h3>Couldn't load tab</h3>;
  }

  const isTabOwner = !!props.user && props.user.uid === props.tab.ownerId;

  return (
    <div className="tab">
      <MetaTags description={`Guitar tab for ${props.tab.title}`} title={props.tab.title} />

      <TabHeader
        existsInServer={props.existsInServer}
        isEditMode={props.isEditMode}
        isTabOwner={isTabOwner}
        playTimeoutRef={playTimeoutRef}
        promptDiscardChanges={props.promptDiscardChanges}
        saveEditChanges={props.saveEditChanges}
        tab={props.tab}
        updateTab={props.updateTab}
      />

      <TabDetails
        isEditMode={props.isEditMode}
        isTabOwner={isTabOwner}
        tab={props.tab}
        updateTab={props.updateTab}
      />

      {props.isEditMode && (
        <React.Fragment>
          <SectionList tab={props.tab} updateTab={props.updateTab} />
          <RhythmList tab={props.tab} updateTab={props.updateTab} />
        </React.Fragment>
      )}

      <BarGroup
        barContainers={barContainers}
        barsNumber={props.tab.bars.length}
        inSection={undefined}
        isEditMode={props.isEditMode}
        scrollView={props.scrollView}
        tab={props.tab}
        updateTab={props.updateTab}
      />

      <TabPlay
        barContainers={barContainers}
        isEditMode={props.isEditMode}
        isTabOwner={isTabOwner}
        playTimeoutRef={playTimeoutRef}
        tab={props.tab}
        updateTab={props.updateTab}
      />
    </div>
  );
};
