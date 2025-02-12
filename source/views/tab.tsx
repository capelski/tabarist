import React, { RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import {
  BarGroup,
  SectionList,
  StrummingPatternList,
  TabDetails,
  TabHeader,
  TabPlay,
} from '../components';
import { queryParameters, ViewMode } from '../constants';
import { User } from '../firebase';
import { barsToBarContainers, tabOperations } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';

export type TabViewProps = {
  user: User | null;
  scrollView: RefObject<HTMLDivElement>;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  const [editingCopy, setEditingCopy] = useState('');
  const [tab, setTab] = useState<Tab>();
  const [viewMode, setViewMode] = useState(ViewMode.adaptive);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isEditMode = !!editingCopy;

  // When entering edit mode from play mode we need to clear the next timeout
  const playTimeoutRef = useRef(0);

  useLayoutEffect(() => {
    function updateSize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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
    }
  }, [searchParams]);

  const { areModesEquivalent, barWidth, barContainers } = useMemo(() => {
    if (tab?.bars) {
      const { areModesEquivalent, barWidth } = tabOperations.getLongestBarWidth(
        tab,
        windowWidth,
        viewMode,
      );
      const barContainers = barsToBarContainers(tab, tab.bars);

      return { areModesEquivalent, barWidth, barContainers };
    }

    return { areModesEquivalent: true, barWidth: -1, barContainers: [] };
  }, [tab?.bars, tab?.sections, tab?.strummingPatterns, viewMode, windowWidth]);

  if (!tab) {
    return <h3>Couldn't load tab</h3>;
  }

  const isTabOwner = !!props.user && props.user.uid === tab.ownerId;

  return (
    <div className="tab">
      <TabHeader
        areModesEquivalent={areModesEquivalent}
        editingCopy={editingCopy}
        isEditMode={isEditMode}
        isTabOwner={isTabOwner}
        playTimeoutRef={playTimeoutRef}
        tab={tab}
        updateEditingCopy={setEditingCopy}
        updateTab={setTab}
        updateViewMode={setViewMode}
        user={props.user}
        viewMode={viewMode}
      />

      <TabDetails isEditMode={isEditMode} isTabOwner={isTabOwner} tab={tab} updateTab={setTab} />

      <BarGroup
        barContainers={barContainers}
        barsNumber={tab.bars.length}
        barWidth={`${barWidth}px`}
        inSection={undefined}
        isEditMode={isEditMode}
        scrollView={props.scrollView}
        tab={tab}
        updateTab={setTab}
      />

      {isEditMode && (
        <React.Fragment>
          <SectionList barWidth={`${barWidth}px`} tab={tab} updateTab={setTab} />
          <StrummingPatternList tab={tab} updateTab={setTab} />
        </React.Fragment>
      )}

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
