import { User } from 'firebase/auth';
import React, { RefObject, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { BarGroup, RhythmList, SectionList, TabDetails, TabHeader, TabPlay } from '../components';
import { queryParameters } from '../constants';
import { barsToBarContainers } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';
import { MetaTags } from './common/meta-tags';

export type TabViewProps = {
  cancelEditChanges: () => void;
  confirmEditChanges: () => void;
  isDirty: boolean;
  isEditMode: boolean;
  scrollView: RefObject<HTMLDivElement>;
  tab?: Tab;
  updateTab: (tab: Tab, updateOriginal?: boolean) => void;
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
        props.updateTab(nextTab, searchParams.get(queryParameters.editMode) === 'true');
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

  const isTabOwner = !!props.user && props.user.uid === props.tab.ownerId;

  return (
    <div className="tab">
      <MetaTags description={`Guitar tab for ${props.tab.title}`} title={props.tab.title} />

      <TabHeader
        cancelEditChanges={props.cancelEditChanges}
        confirmEditChanges={props.confirmEditChanges}
        isDirty={props.isDirty}
        isEditMode={props.isEditMode}
        isTabOwner={isTabOwner}
        playTimeoutRef={playTimeoutRef}
        tab={props.tab}
        updateTab={props.updateTab}
        user={props.user}
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
