import { User } from 'firebase/auth';
import React, { RefObject, useContext, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { BarGroup, RhythmList, SectionList, TabDetails, TabHeader, TabPlay } from '../components';
import { QueryParameters } from '../constants';
import { barsToBarContainers } from '../operations';
import { tabRepository } from '../repositories';
import { ActionType, DispatchProvider } from '../state';
import { Tab } from '../types';
import { MetaTags } from './common/meta-tags';

export type TabViewProps = {
  isDraft?: boolean;
  isEditMode: boolean;
  saveEditChanges: () => void;
  scrollView: RefObject<HTMLDivElement>;
  tab?: Tab;
  user: User | null;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  // When entering edit mode from play mode we need to clear the next timeout
  const playTimeoutRef = useRef(0);

  const dispatch = useContext(DispatchProvider);
  const [searchParams] = useSearchParams();
  const { tabId } = useParams();

  useEffect(() => {
    if (tabId && props.tab?.id !== tabId) {
      tabRepository.getById(tabId).then((nextTab) => {
        if (nextTab) {
          dispatch({
            type: ActionType.setTab,
            payload: {
              document: nextTab,
              isEditMode: searchParams.get(QueryParameters.editMode) === 'true',
            },
          });
        }
      });
    }
  }, [tabId]);

  // Update edit mode upon browser back/forward navigation
  useEffect(() => {
    if (props.isEditMode && searchParams.get(QueryParameters.editMode) !== 'true') {
      dispatch({ type: ActionType.discardChangesPrompt });
    } else if (
      !props.isEditMode &&
      searchParams.get(QueryParameters.editMode) === 'true' &&
      props.tab
    ) {
      dispatch({
        type: ActionType.setTab,
        payload: { document: props.tab, isDraft: props.isDraft },
      });
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

  const updateTab = (nextTab: Tab) => {
    dispatch({ type: ActionType.updateTab, payload: nextTab });
  };

  return (
    <div className="tab">
      <MetaTags description={`Guitar tab for ${props.tab.title}`} title={props.tab.title} />

      <TabHeader
        isDraft={props.isDraft}
        isEditMode={props.isEditMode}
        isTabOwner={isTabOwner}
        playTimeoutRef={playTimeoutRef}
        saveEditChanges={props.saveEditChanges}
        tab={props.tab}
        updateTab={updateTab}
      />

      <TabDetails
        isEditMode={props.isEditMode}
        isTabOwner={isTabOwner}
        tab={props.tab}
        updateTab={updateTab}
      />

      {props.isEditMode && (
        <React.Fragment>
          <SectionList tab={props.tab} updateTab={updateTab} />
          <RhythmList tab={props.tab} updateTab={updateTab} />
        </React.Fragment>
      )}

      <BarGroup
        barContainers={barContainers}
        barsNumber={props.tab.bars.length}
        inSection={undefined}
        isEditMode={props.isEditMode}
        scrollView={props.scrollView}
        tab={props.tab}
        updateTab={updateTab}
      />

      <TabPlay
        barContainers={barContainers}
        isEditMode={props.isEditMode}
        isTabOwner={isTabOwner}
        playTimeoutRef={playTimeoutRef}
        tab={props.tab}
        updateTab={updateTab}
      />
    </div>
  );
};
