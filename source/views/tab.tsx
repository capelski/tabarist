import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router';
import {
  AddBar,
  AddBarProps,
  BarComponent,
  BarProps,
  StrummingPatternComponent,
} from '../components';
import {
  addSymbol,
  BarType,
  editSymbol,
  queryParameters,
  removeSymbol,
  RouteNames,
  saveSymbol,
  stringHeight,
} from '../constants';
import {
  addBarToTab,
  addStrummingPatternToTab,
  createChordBar,
  createPickingBar,
  createReferenceBar,
  getTabLocalStorageKey,
  removeBarFromTab,
  updateChordBar,
  updateChordBarFrames,
  updatePickingBar,
  updatePickingBarFrames,
  updateStrummingPatternFrames,
  updateStrummingPatternValue,
  updateTitle,
} from '../logic';
import { Bar, ChordBar, PickingBar, Tab } from '../types';

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

  const isBigScreen = useMediaQuery({ minWidth: 1000 });
  const isMediumScreen = useMediaQuery({ minWidth: 600 });
  const barWidth = isBigScreen ? 25 : isMediumScreen ? 50 : 100;

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

  const addBar: AddBarProps['addBar'] = (index, type) => {
    const bar =
      type === BarType.chord
        ? createChordBar(index, tab.strummingPatterns[0])
        : createPickingBar(index);
    setTab(addBarToTab(tab, bar));
  };

  const addStrummingPattern = () => {
    setTab(addStrummingPatternToTab(tab, tab.strummingPatterns.length));
  };

  const getBarHandlers = (bar: Bar): BarProps['handlers'] => ({
    addBar,
    addStrummingPattern,
    copyBar() {
      setTab(addBarToTab(tab, createReferenceBar(bar)));
    },
    removeBar() {
      setTab(removeBarFromTab(tab, bar.index));
    },
    updateChordBar(frameIndex, value) {
      setTab(updateChordBar(tab, bar.index, frameIndex, value));
    },
    updateChordBarFrames(sPatternIndex) {
      setTab(updateChordBarFrames(tab, bar.index, sPatternIndex));
    },
    updatePickingBar(frameIndex, stringIndex, value) {
      setTab(updatePickingBar(tab, bar.index, frameIndex, stringIndex, value));
    },
    updatePickingBarFrames(frames) {
      setTab(updatePickingBarFrames(tab, bar.index, frames));
    },
  });

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
                setTab(updateTitle(tab, event.target.value));
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

      <div
        className="bars"
        style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%' }}
      >
        {tab.bars.map((bar) => {
          const actualBar =
            bar.type === BarType.reference
              ? (tab.bars.find((b) => b.index === bar.barIndex) as ChordBar | PickingBar)
              : bar;

          return (
            <BarComponent
              backgroundColor={actualBar.index !== bar.index && isEditMode ? '#ddd' : 'white'}
              bar={actualBar}
              currentIndex={bar.index}
              handlers={getBarHandlers(bar)}
              isEditMode={isEditMode}
              key={bar.index}
              strummingPatterns={tab.strummingPatterns}
              width={barWidth}
            />
          );
        })}

        {isEditMode && (
          <AddBar
            addBar={addBar}
            barIndex={tab.bars.length}
            expanded={true}
            style={{
              boxSizing: 'border-box',
              flexBasis: `${barWidth}%`,
              height: stringHeight * 6,
              padding: '0 8px',
            }}
          />
        )}
      </div>

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
                strummingPattern={sPattern}
                updateFrames={(framesNumber) => {
                  setTab(updateStrummingPatternFrames(tab, sPattern.index, framesNumber));
                }}
                updateValue={(frameIndex, value) => {
                  setTab(updateStrummingPatternValue(tab, sPattern.index, frameIndex, value));
                }}
              />
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
};
