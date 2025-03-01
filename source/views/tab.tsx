import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { BarGroup, RhythmList, SectionList, TabDetails, TabHeader, TabPlay } from '../components';
import { queryParameters } from '../constants';
import { User } from '../firebase';
import { barsToBarContainers } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';

export type TabViewProps = {
  user: User | null;
  scrollView: RefObject<HTMLDivElement>;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  const [editingCopy, setEditingCopy] = useState('');
  const [tab, setTab] = useState<Tab>();
  const isEditMode = !!editingCopy;

  // When entering edit mode from play mode we need to clear the next timeout
  const playTimeoutRef = useRef(0);

  const [searchParams] = useSearchParams();
  const { tabId } = useParams();

  useEffect(() => {
    if (tabId) {
      tabRepository.getById(tabId).then((tab) => {
        setTab(tab);
        if (searchParams.get(queryParameters.editMode) === 'true') {
          setEditingCopy(JSON.stringify(tab));
        }
      });
    }
  }, [tabId]);

  useEffect(() => {
    if (isEditMode && searchParams.get(queryParameters.editMode) !== 'true') {
      setEditingCopy('');
    } else if (!isEditMode && searchParams.get(queryParameters.editMode) === 'true' && tab) {
      setEditingCopy(JSON.stringify(tab));
    }
  }, [searchParams]);

  const barContainers = useMemo(() => {
    if (tab?.bars) {
      return barsToBarContainers(tab, tab.bars);
    }

    return [];
  }, [tab?.bars, tab?.rhythms, tab?.sections]);

  if (!tab) {
    return <h3>Couldn't load tab</h3>;
  }

  const isTabOwner = !!props.user && props.user.uid === tab.ownerId;

  return (
    <div className="tab">
      <TabHeader
        editingCopy={editingCopy}
        isEditMode={isEditMode}
        isTabOwner={isTabOwner}
        playTimeoutRef={playTimeoutRef}
        tab={tab}
        updateEditingCopy={setEditingCopy}
        updateTab={setTab}
        user={props.user}
      />

      <TabDetails isEditMode={isEditMode} isTabOwner={isTabOwner} tab={tab} updateTab={setTab} />

      {isEditMode && (
        <React.Fragment>
          <SectionList tab={tab} updateTab={setTab} />
          <RhythmList tab={tab} updateTab={setTab} />
        </React.Fragment>
      )}

      <BarGroup
        barContainers={barContainers}
        barsNumber={tab.bars.length}
        inSection={undefined}
        isEditMode={isEditMode}
        scrollView={props.scrollView}
        tab={tab}
        updateTab={setTab}
      />

      <TabPlay
        barContainers={barContainers}
        isEditMode={isEditMode}
        isTabOwner={isTabOwner}
        playTimeoutRef={playTimeoutRef}
        tab={tab}
        updateTab={setTab}
      />
    </div>
  );
};
