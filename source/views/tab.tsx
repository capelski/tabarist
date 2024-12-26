import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router';
import { StrummingPatternComponent } from '../components';
import { BarGroup } from '../components/bar-group';
import {
  addSymbol,
  BarType,
  editSymbol,
  queryParameters,
  removeSymbol,
  RouteNames,
  saveSymbol,
} from '../constants';
import {
  createChordBar,
  createPickingBar,
  createReferenceBar,
  getIndexDisplayValue,
  getTabLocalStorageKey,
  sectionService,
  sPatternService,
  tabService,
} from '../logic';
import { Bar, Section, Tab } from '../types';

export type TabProps = {
  removeTab: (tabId: string) => void;
  updateTab: (updatedTab: Tab) => void;
};

export const TabView: React.FC<TabProps> = (props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tab, setTab] = useState<Tab>();

  const [searchParams, setSearchParams] = useSearchParams();
  const { tabId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stringifiedTab = localStorage.getItem(getTabLocalStorageKey(tabId!));
    if (stringifiedTab) {
      try {
        const nextSelectedTab = JSON.parse(stringifiedTab);
        setTab(nextSelectedTab);
      } catch (error) {
        console.error('Error retrieving the selected tab', error);
      }
    }
  }, [tabId]);

  useEffect(() => {
    if (searchParams.get(queryParameters.editMode) === 'true') {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [searchParams]);

  if (!tab) {
    return (
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <NavLink style={{ marginRight: 8 }} to={RouteNames.home}>
          ⬅️
        </NavLink>
        <h3>Couldn't load tab</h3>
      </div>
    );
  }

  const addBar =
    (section: Section | undefined) => (index: number, type: BarType.chord | BarType.picking) => {
      const bar =
        type === BarType.chord
          ? createChordBar(index, tab.strummingPatterns[0])
          : createPickingBar(index);
      const nextTab = section
        ? sectionService.addBar(tab, section.index, bar)
        : tabService.addBar(tab, bar);
      setTab(nextTab);
    };

  const addSection = () => {
    setTab(tabService.addSection(tab));
  };

  const addStrummingPattern = () => {
    setTab(tabService.addStrummingPattern(tab));
  };

  const copyBar = (section: Section | undefined) => (bar: Bar) => {
    const newBar = createReferenceBar(bar);
    const nextTab = section
      ? sectionService.addBar(tab, section.index, newBar)
      : tabService.addBar(tab, newBar);
    setTab(nextTab);
  };

  const removeBar = (section: Section | undefined) => (deletionIndex: number) => {
    const nextTab = section
      ? sectionService.removeBar(tab, section.index, deletionIndex)
      : tabService.removeBar(tab, deletionIndex);
    setTab(nextTab);
  };

  const toggleEditMode = () => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (isEditMode) {
      props.updateTab(tab);
      nextSearchParams.delete(queryParameters.editMode);
    } else {
      nextSearchParams.set(queryParameters.editMode, 'true');
    }

    setIsEditMode(!isEditMode);
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="tab">
      <NavLink style={{ marginRight: 8 }} to={RouteNames.home}>
        ⬅️ Home page
      </NavLink>
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <h3>
          {isEditMode ? (
            <input
              value={tab.title}
              onChange={(event) => {
                setTab(tabService.updateTitle(tab, event.target.value));
              }}
            />
          ) : (
            tab.title
          )}
        </h3>
        <div style={{ marginLeft: 8 }}>
          <button onClick={toggleEditMode} type="button">
            {isEditMode ? saveSymbol : editSymbol}
          </button>
        </div>
        <div style={{ marginLeft: 8 }}>
          <button
            onClick={() => {
              props.removeTab(tab.id);
              navigate(RouteNames.home);
            }}
            type="button"
          >
            {removeSymbol}
          </button>
        </div>
      </div>

      <BarGroup
        addBar={addBar(undefined)}
        bars={tab.bars}
        getChordBarHandlers={(bar) => ({
          addBar(type) {
            addBar(undefined)(bar.index, type);
          },
          addStrummingPattern,
          copyBar() {
            copyBar(undefined)(bar);
          },
          rebase(sPatternIndex) {
            setTab(tabService.rebaseChordBar(tab, bar.index, sPatternIndex));
          },
          removeBar() {
            removeBar(undefined)(bar.index);
          },
          updateFrame(frameIndex, value) {
            setTab(tabService.updateChordFrame(tab, bar.index, frameIndex, value));
          },
        })}
        getPickingBarHandlers={(bar) => ({
          addBar(type) {
            addBar(undefined)(bar.index, type);
          },
          copyBar() {
            copyBar(undefined)(bar);
          },
          rebase(frames) {
            setTab(tabService.rebasePickingBar(tab, bar.index, frames));
          },
          removeBar() {
            removeBar(undefined)(bar.index);
          },
          updateFrame(frameIndex, stringIndex, value) {
            setTab(tabService.updatePickingFrame(tab, bar.index, frameIndex, stringIndex, value));
          },
        })}
        isEditMode={isEditMode}
        strummingPatterns={tab.strummingPatterns}
      />

      {isEditMode && (
        <React.Fragment>
          <h3>Strumming patterns</h3>
          <p>
            <button onClick={addStrummingPattern} type="button">
              {addSymbol} strumming pattern
            </button>
          </p>

          {tab.strummingPatterns.map((sPattern) => {
            return (
              <StrummingPatternComponent
                key={sPattern.index}
                rebase={(framesNumber) => {
                  setTab(sPatternService.rebase(tab, sPattern.index, framesNumber));
                }}
                strummingPattern={sPattern}
                update={(frameIndex, value) => {
                  setTab(sPatternService.update(tab, sPattern.index, frameIndex, value));
                }}
              />
            );
          })}

          <h3>Sections</h3>
          <p>
            <button onClick={addSection} type="button">
              {addSymbol} section
            </button>
          </p>

          {tab.sections.map((section) => {
            return (
              <React.Fragment key={section.index}>
                {section.name || `Section ${getIndexDisplayValue(section.index)}`}

                <BarGroup
                  addBar={addBar(section)}
                  bars={section.bars}
                  getChordBarHandlers={(bar) => ({
                    addBar(type) {
                      addBar(section)(bar.index, type);
                    },
                    addStrummingPattern,
                    rebase(sPatternIndex) {
                      setTab(
                        sectionService.rebaseChordBar(tab, section.index, bar.index, sPatternIndex),
                      );
                    },
                    copyBar() {
                      copyBar(section)(bar);
                    },
                    removeBar() {
                      removeBar(section)(bar.index);
                    },
                    updateFrame(frameIndex, value) {
                      setTab(
                        sectionService.updateChordFrame(
                          tab,
                          section.index,
                          bar.index,
                          frameIndex,
                          value,
                        ),
                      );
                    },
                  })}
                  getPickingBarHandlers={(bar) => ({
                    addBar(type) {
                      addBar(section)(bar.index, type);
                    },
                    copyBar() {
                      copyBar(section)(bar);
                    },
                    removeBar() {
                      removeBar(section)(bar.index);
                    },
                    rebase(frames) {
                      setTab(
                        sectionService.rebasePickingBar(tab, section.index, bar.index, frames),
                      );
                    },
                    updateFrame(frameIndex, stringIndex, value) {
                      setTab(
                        sectionService.updatePickingFrame(
                          tab,
                          section.index,
                          bar.index,
                          frameIndex,
                          stringIndex,
                          value,
                        ),
                      );
                    },
                  })}
                  isEditMode={isEditMode}
                  strummingPatterns={tab.strummingPatterns}
                />
              </React.Fragment>
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
};
