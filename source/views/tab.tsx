import { User } from 'firebase/auth';
import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { BarGroup, RhythmList, SectionList, TabDetails, TabHeader, TabPlay } from '../components';
import { queryParameters } from '../constants';
import { barsToBarContainers } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';
import { MetaTags } from './common/meta-tags';

export type TabViewProps = {
  scrollView: RefObject<HTMLDivElement>;
  setTab: (tab: Tab) => void;
  tab?: Tab;
  user: User | null;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  const [editingCopy, setEditingCopy] = useState('');
  const isEditMode = !!editingCopy;

  // When entering edit mode from play mode we need to clear the next timeout
  const playTimeoutRef = useRef(0);

  const [searchParams] = useSearchParams();
  const { tabId } = useParams();

  useEffect(() => {
    if (tabId && props.tab?.id !== tabId) {
      tabRepository.getById(tabId).then((nextTab) => {
        props.setTab(nextTab);
        if (searchParams.get(queryParameters.editMode) === 'true') {
          setEditingCopy(JSON.stringify(nextTab));
        }
      });
    }
  }, [tabId]);

  useEffect(() => {
    if (isEditMode && searchParams.get(queryParameters.editMode) !== 'true') {
      setEditingCopy('');
    } else if (!isEditMode && searchParams.get(queryParameters.editMode) === 'true' && props.tab) {
      setEditingCopy(JSON.stringify(props.tab));
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
        editingCopy={editingCopy}
        isEditMode={isEditMode}
        isTabOwner={isTabOwner}
        playTimeoutRef={playTimeoutRef}
        tab={props.tab}
        updateEditingCopy={setEditingCopy}
        updateTab={props.setTab}
        user={props.user}
      />

      <TabDetails
        isEditMode={isEditMode}
        isTabOwner={isTabOwner}
        tab={props.tab}
        updateTab={props.setTab}
      />

      {isEditMode && (
        <React.Fragment>
          <SectionList tab={props.tab} updateTab={props.setTab} />
          <RhythmList tab={props.tab} updateTab={props.setTab} />
        </React.Fragment>
      )}

      <BarGroup
        barContainers={barContainers}
        barsNumber={props.tab.bars.length}
        inSection={undefined}
        isEditMode={isEditMode}
        scrollView={props.scrollView}
        tab={props.tab}
        updateTab={props.setTab}
      />

      <TabPlay
        barContainers={barContainers}
        isEditMode={isEditMode}
        isTabOwner={isTabOwner}
        playTimeoutRef={playTimeoutRef}
        tab={props.tab}
        updateTab={props.setTab}
      />
    </div>
  );
};
