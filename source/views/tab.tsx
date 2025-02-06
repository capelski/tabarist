import React, { RefObject, useEffect, useLayoutEffect, useMemo, useState } from 'react';
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
  scrollView: RefObject<HTMLDivElement>;
};

let activeFrameLastDelay = 0;
let activeFrameLastRender = 0;
let activeFrameLastTimeout = 0;

export const TabView: React.FC<TabViewProps> = (props) => {
  const [deletingTab, setDeletingTab] = useState('');
  const [discardingChanges, setDiscardingChanges] = useState(false);
  const [editingCopy, setEditingCopy] = useState('');
  const [tab, setTab] = useState<Tab>();
  const [viewMode, setViewMode] = useState(ViewMode.adaptive);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isEditMode = !!editingCopy;

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
      tabRepository.getById(tabId).then((tab) => {
        setTab(tab);
        if (searchParams.get(queryParameters.editMode) === 'true') {
          setEditingCopy(JSON.stringify(tab));
        }
      });
    }
  }, [tabId]);

  const updateActiveFrame = () => {
    if (tab?.tempo && tab.activeFrame) {
      const msPerBeat = 60_000 / tab.tempo;
      const msPerBar = msPerBeat * 4;
      const msPerFrame = msPerBar / tab.activeFrame.barContainer.renderedBar.frames.length;

      activeFrameLastDelay = Date.now() - activeFrameLastRender; // - msPerFrame;

      activeFrameLastTimeout = window.setTimeout(() => {
        setTab(tabOperations.updateActiveFrame(tab, barContainers));
        activeFrameLastRender = Date.now();
      }, msPerFrame - activeFrameLastDelay);
    } else {
      activeFrameLastDelay = 0;
      activeFrameLastRender = 0;
    }
  };

  useEffect(updateActiveFrame, [tab?.activeFrame]);

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

  const cancelExitEditMode = () => {
    setDiscardingChanges(false);
  };

  const confirmDelete = async () => {
    if (!isTabOwner) {
      return;
    }

    await tabRepository.remove(deletingTab);
    cancelDelete();
    navigate(RouteNames.myTabs);
  };

  const confirmExitEditMode = () => {
    setDiscardingChanges(false);
    setEditingCopy('');
    setTab(JSON.parse(editingCopy));

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(queryParameters.editMode);
    setSearchParams(nextSearchParams);
  };

  const enterEditMode = () => {
    if (!isTabOwner) {
      return;
    }

    setEditingCopy(JSON.stringify(tab));
    exitPlayMode();

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(queryParameters.editMode, 'true');
    setSearchParams(nextSearchParams);
  };

  const enterPlayMode = () => {
    setTab(tabOperations.updateActiveFrame(tab, barContainers));

    activeFrameLastRender = Date.now();
  };
  const exitEditMode = () => {
    if (JSON.stringify(tab) === editingCopy) {
      confirmExitEditMode();
    } else {
      setDiscardingChanges(true);
    }
  };

  const exitPlayMode = () => {
    clearTimeout(activeFrameLastTimeout);
    setTab(tabOperations.resetActiveFrame(tab));
  };

  const removeTab = () => {
    setDeletingTab(tab.id);
  };

  const saveEditModeChanges = async () => {
    await tabRepository.set(tab, props.user!.uid);

    setEditingCopy('');

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(queryParameters.editMode);
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

      {discardingChanges && (
        <Modal closeHandler={cancelExitEditMode}>
          <p>Do you want to discard the unsaved changes?</p>
          <div>
            <button onClick={confirmExitEditMode} style={{ marginRight: 8 }} type="button">
              Yes
            </button>
            <button onClick={cancelExitEditMode} type="button">
              No
            </button>
          </div>
        </Modal>
      )}

      <div style={{ alignItems: 'center', display: 'flex' }}>
        <h3 style={{ flexGrow: 1 }}>
          {isEditMode ? (
            <input
              value={tab.title}
              onChange={(event) => {
                setTab(tabOperations.updateTitle(tab, event.target.value));
              }}
              style={{
                fontSize: '1em', // Mimics <h3>
                width: '95%',
              }}
            />
          ) : (
            tab.title
          )}
        </h3>
        {isTabOwner && (
          <React.Fragment>
            {isEditMode ? (
              <React.Fragment>
                <button onClick={saveEditModeChanges} style={{ marginLeft: 8 }} type="button">
                  {saveSymbol}
                </button>
                <button onClick={exitEditMode} style={{ marginLeft: 8 }} type="button">
                  ❌
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button onClick={enterEditMode} style={{ marginLeft: 8 }} type="button">
                  {editSymbol}
                </button>
                <button onClick={removeTab} style={{ marginLeft: 8 }} type="button">
                  {removeSymbol}
                </button>
              </React.Fragment>
            )}
          </React.Fragment>
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

      {(isEditMode || tab.capo) && (
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 8 }}>
          <span style={{ marginRight: 8 }}>Capo: </span>
          {isEditMode ? (
            <input
              onChange={(event) => {
                const nextCapo = parseInt(event.target.value);
                const nextTab = tabOperations.updateCapo(
                  tab,
                  isNaN(nextCapo) ? undefined : nextCapo,
                );
                setTab(nextTab);
              }}
              type="number"
              value={tab.capo ?? ''}
            />
          ) : (
            <span>{tab.capo}</span>
          )}
        </div>
      )}

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
            <a href={tab.backingTrack} style={{ flexGrow: 1 }} target="_blank">
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
        scrollView={props.scrollView}
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

      <div style={{ backgroundColor: 'white', bottom: 0, paddingTop: 8, position: 'sticky' }}>
        <span style={{ marginLeft: 8 }}>♫</span>
        <input
          disabled={!!tab.activeFrame}
          onBlur={() => {
            if (tab.tempo) {
              const validTempo = Math.max(Math.min(tab.tempo, maxTempo), minTempo);
              if (validTempo !== tab.tempo) {
                setTab(tabOperations.updateTempo(tab, validTempo));
              }
            }
          }}
          onChange={(event) => {
            const parsedTempo = parseInt(event.target.value);
            const nextTempo = isNaN(parsedTempo) ? undefined : parsedTempo;
            setTab(tabOperations.updateTempo(tab, nextTempo));
          }}
          value={tab.tempo ?? ''}
          style={{ marginLeft: 8, maxWidth: 40 }}
          type="number"
        />

        {!isEditMode && (
          <button
            disabled={!tab.tempo}
            onClick={() => {
              if (tab.activeFrame === undefined) {
                enterPlayMode();
              } else {
                exitPlayMode();
              }
            }}
            style={{ marginLeft: 8 }}
            type="button"
          >
            {tab.activeFrame !== undefined ? 'Stop' : 'Play'}
          </button>
        )}
      </div>
    </div>
  );
};
