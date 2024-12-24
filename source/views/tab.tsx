import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router';
import {
  AddCompass,
  AddCompassProps,
  CompassComponent,
  CompassProps,
  StrummingPatternComponent,
} from '../components';
import {
  addSymbol,
  CompassType,
  editSymbol,
  queryParameters,
  removeSymbol,
  RouteNames,
  saveSymbol,
  stringHeight,
} from '../constants';
import {
  addCompassToTab,
  addStrummingPatternToTab,
  createChordCompass,
  createCompassReference,
  createPickingCompass,
  getTabLocalStorageKey,
  removeCompassFromTab,
  updateChordCompass,
  updateChordCompassFrames,
  updatePickingCompass,
  updatePickingCompassFrames,
  updateStrummingPatternFrames,
  updateStrummingPatternValue,
  updateTitle,
} from '../logic';
import { ChordCompass, Compass, PickingCompass, Tab } from '../types';

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
  const compassWidth = isBigScreen ? 25 : isMediumScreen ? 50 : 100;

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

  const addCompass: AddCompassProps['addCompass'] = (index, type) => {
    const compass =
      type === CompassType.chord
        ? createChordCompass(index, tab.strummingPatterns[0])
        : createPickingCompass(index);
    setTab(addCompassToTab(tab, compass));
  };

  const addStrummingPattern = () => {
    setTab(addStrummingPatternToTab(tab, tab.strummingPatterns.length));
  };

  const getCompassHandlers = (compass: Compass): CompassProps['handlers'] => ({
    addCompass(index, type) {
      addCompass(index, type);
    },
    addStrummingPattern() {
      addStrummingPattern();
    },
    copyCompass() {
      setTab(addCompassToTab(tab, createCompassReference(compass)));
    },
    removeCompass() {
      setTab(removeCompassFromTab(tab, compass.index));
    },
    updateChordCompass(frameIndex, value) {
      setTab(updateChordCompass(tab, compass.index, frameIndex, value));
    },
    updateChordCompassFrames(sPatternIndex) {
      setTab(updateChordCompassFrames(tab, compass.index, sPatternIndex));
    },
    updatePickingCompass(frameIndex, stringIndex, value) {
      setTab(updatePickingCompass(tab, compass.index, frameIndex, stringIndex, value));
    },
    updatePickingCompassFrames(frames) {
      setTab(updatePickingCompassFrames(tab, compass.index, frames));
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
        className="compasses"
        style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%' }}
      >
        {tab.compasses.map((compass) => {
          const actualCompass =
            compass.type === CompassType.reference
              ? (tab.compasses.find((c) => c.index === compass.compassIndex) as
                  | ChordCompass
                  | PickingCompass)
              : compass;

          return (
            <CompassComponent
              backgroundColor={
                actualCompass.index !== compass.index && isEditMode ? '#ddd' : 'white'
              }
              compass={actualCompass}
              currentIndex={compass.index}
              handlers={getCompassHandlers(compass)}
              isEditMode={isEditMode}
              key={compass.index}
              strummingPatterns={tab.strummingPatterns}
              width={compassWidth}
            />
          );
        })}

        {isEditMode && (
          <AddCompass
            addCompass={addCompass}
            compassIndex={tab.compasses.length}
            expanded={true}
            style={{
              boxSizing: 'border-box',
              flexBasis: `${compassWidth}%`,
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

          {tab.strummingPatterns.map((sp) => {
            return (
              <StrummingPatternComponent
                key={sp.index}
                strummingPattern={sp}
                updateFrames={(framesNumber) => {
                  setTab(updateStrummingPatternFrames(tab, sp.index, framesNumber));
                }}
                updateValue={(frameIndex, value) => {
                  setTab(updateStrummingPatternValue(tab, sp.index, frameIndex, value));
                }}
              />
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
};
