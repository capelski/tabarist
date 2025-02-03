import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { BarGroup, Modal, SectionComponent, StrummingPatternComponent } from '../components';
import {
  addSymbol,
  editSymbol,
  maxTempo,
  minTempo,
  queryParameters,
  removeSymbol,
  RouteNames,
  saveSymbol,
  ViewMode,
} from '../constants';
import { User } from '../firebase';
import { barsToBarContainers, sPatternOperations, tabOperations } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';

export type TabViewProps = {
  user: User | null;
};

let activeFrameLastTimeout = 0;

export const TabView: React.FC<TabViewProps> = (props) => {
  const [deletingTab, setDeletingTab] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [tab, setTab] = useState<Tab>();
  const [viewMode, setViewMode] = useState(ViewMode.adaptive);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useLayoutEffect(() => {
    function updateSize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const { tabId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (tabId) {
      tabRepository.getById(tabId).then(setTab);
    }
  }, [tabId]);

  useEffect(() => {
    if (searchParams.get(queryParameters.editMode) === 'true') {
      setIsEditMode(true);
      if (tab) {
        setTab(tabOperations.resetActiveFrame(tab));
      }
    } else {
      setIsEditMode(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (tab?.activeFrame) {
      const msPerBeat = 60_000 / tab.tempo;
      const msPerBar = msPerBeat * 4;
      const msPerFrame = msPerBar / tab.activeFrame.barContainer.renderedBar.frames.length;

      activeFrameLastTimeout = window.setTimeout(() => {
        setTab(tabOperations.updateActiveFrame(tab, barContainers));
      }, msPerFrame);
    }
  }, [tab?.activeFrame]);

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
  }, [tab?.bars, viewMode, windowWidth]);

  if (!tab) {
    return <h3>Couldn't load tab</h3>;
  }

  const isTabOwner = props.user && props.user.uid === tab.ownerId;

  const addSection = () => {
    setTab(tabOperations.addSection(tab));
  };

  const addStrummingPattern = () => {
    setTab(tabOperations.addStrummingPattern(tab));
  };

  const cancelDelete = () => {
    setDeletingTab('');
  };

  const confirmDelete = async () => {
    if (!isTabOwner) {
      return;
    }

    await tabRepository.remove(deletingTab);
    cancelDelete();
    navigate(RouteNames.myTabs);
  };

  const removeTab = () => {
    setDeletingTab(tab.id);
  };

  const toggleEditMode = async () => {
    if (!isTabOwner) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);

    if (isEditMode) {
      await tabRepository.set(tab, props.user!.uid);

      nextSearchParams.delete(queryParameters.editMode);
    } else {
      nextSearchParams.set(queryParameters.editMode, 'true');
    }

    setIsEditMode(!isEditMode);
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="tab">
      {deletingTab && (
        <Modal closeHandler={cancelDelete}>
          <p>Are you sure you want to delete this tab?</p>
          <div>
            <button onClick={confirmDelete} style={{ marginRight: 8 }} type="button">
              Delete
            </button>
            <button onClick={cancelDelete} type="button">
              Cancel
            </button>
          </div>
        </Modal>
      )}

      <div style={{ alignItems: 'center', display: 'flex' }}>
        <h3>
          {isEditMode ? (
            <input
              value={tab.title}
              onChange={(event) => {
                setTab(tabOperations.updateTitle(tab, event.target.value));
              }}
            />
          ) : (
            tab.title
          )}
        </h3>
        {isTabOwner && (
          <React.Fragment>
            <button onClick={toggleEditMode} style={{ marginLeft: 8 }} type="button">
              {isEditMode ? saveSymbol : editSymbol}
            </button>
            <button onClick={removeTab} style={{ marginLeft: 8 }} type="button">
              {removeSymbol}
            </button>
          </React.Fragment>
        )}

        <span style={{ marginLeft: 8 }}>♫</span>
        <input
          onBlur={() => {
            const validTempo = Math.max(Math.min(tab.tempo, maxTempo), minTempo);
            if (validTempo !== tab.tempo) {
              setTab(tabOperations.updateTempo(tab, validTempo));
            }
          }}
          onChange={(event) => {
            const nextTempo = parseInt(event.target.value);
            setTab(tabOperations.updateTempo(tab, nextTempo));
          }}
          value={tab.tempo}
          style={{ marginLeft: 8, maxWidth: 40 }}
          type="number"
        />

        {!isEditMode && (
          <button
            onClick={() => {
              const nextTab =
                tab.activeFrame === undefined
                  ? tabOperations.updateActiveFrame(tab, barContainers)
                  : tabOperations.resetActiveFrame(tab);
              clearTimeout(activeFrameLastTimeout);

              setTab(nextTab);
            }}
            style={{ marginLeft: 8 }}
            type="button"
          >
            {tab.activeFrame !== undefined ? 'Stop' : 'Play'}
          </button>
        )}

        {!areModesEquivalent && (
          <React.Fragment>
            <span style={{ marginLeft: 8 }}>👁️</span>
            <select
              onChange={(event) => {
                const nextViewMode = event.target.value as ViewMode;
                setViewMode(nextViewMode);
              }}
              style={{ marginLeft: 8 }}
              value={viewMode}
            >
              {Object.values(ViewMode).map((viewMode) => {
                return (
                  <option key={viewMode} value={viewMode}>
                    {viewMode}
                  </option>
                );
              })}
            </select>
          </React.Fragment>
        )}
      </div>

      {(isEditMode || tab.backingTrack) && (
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 8 }}>
          <span style={{ marginRight: 8 }}>Backing track: </span>
          {isEditMode ? (
            <input
              onChange={(event) => {
                const nextTab = tabOperations.updateBackingTrack(tab, event.target.value);
                setTab(nextTab);
              }}
              style={{ flexGrow: 1 }}
              value={tab.backingTrack ?? ''}
            />
          ) : (
            <a style={{ flexGrow: 1 }} href={tab.backingTrack}>
              {tab.backingTrack}
            </a>
          )}
        </div>
      )}

      <BarGroup
        barContainers={barContainers}
        barsNumber={tab.bars.length}
        barWidth={`${barWidth}px`}
        inSection={undefined}
        isEditMode={isEditMode}
        tab={tab}
        updateTab={setTab}
      />

      {isEditMode && (
        <React.Fragment>
          <h3>Strumming patterns</h3>

          {tab.strummingPatterns.map((sPattern) => {
            return (
              <StrummingPatternComponent
                key={sPattern.index}
                rebase={(framesNumber) => {
                  setTab(sPatternOperations.rebase(tab, sPattern.index, framesNumber));
                }}
                strummingPattern={sPattern}
                tab={tab}
                update={(frameIndex, value) => {
                  setTab(sPatternOperations.update(tab, sPattern.index, frameIndex, value));
                }}
                updateTab={setTab}
              />
            );
          })}

          <p>
            <button onClick={addStrummingPattern} type="button">
              {addSymbol} strumming pattern
            </button>
          </p>

          <h3>Sections</h3>

          {tab.sections.map((section) => {
            return (
              <SectionComponent
                barWidth={`${barWidth}px`}
                isEditMode={isEditMode}
                key={section.index}
                section={section}
                tab={tab}
                updateTab={setTab}
              />
            );
          })}

          <p>
            <button onClick={addSection} type="button">
              {addSymbol} section
            </button>
          </p>
        </React.Fragment>
      )}
    </div>
  );
};
