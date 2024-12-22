import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavLink, useParams } from 'react-router';
import { editSymbol, RouteNames, saveSymbol, stringHeight } from '../constants';
import {
  addCompassToTab,
  arrayIndexToCompassIndex,
  createCompassReference,
  getTabLocalStorageKey,
  removeCompassFromTab,
  resetEditIndex,
  setEditIndex,
  updateChordCompass,
  updateCompassFrames,
  updatePickingCompass,
  updateTitle,
} from '../logic';
import { ChordCompass, Compass, PickingCompass, Tab } from '../types';
import { AddCompass } from './add-compass';
import { CompassComponent, CompassProps } from './compass';

export type TabProps = {
  updateTab: (updatedTab: Tab) => void;
};

export const TabComponent: React.FC<TabProps> = (props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tab, setTab] = useState<Tab>();

  const { tabId } = useParams();

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

  const addCompass = (compass: Compass) => {
    setTab(addCompassToTab(tab, compass));
  };

  const getHandlers = (compass: Compass): CompassProps['handlers'] => ({
    addCompass(newCompass) {
      addCompass(newCompass);
    },
    copyCompass() {
      addCompass(createCompassReference(compass));
    },
    editCompass() {
      setTab(setEditIndex(tab, compass.index));
    },
    editCompassFinish() {
      setTab(resetEditIndex(tab));
    },
    removeCompass() {
      setTab(removeCompassFromTab(tab, compass.index));
    },
    updateChordCompass(frameIndex, value) {
      setTab(updateChordCompass(tab, compass.index, frameIndex, value));
    },
    updateCompassFrames(frames) {
      setTab(updateCompassFrames(tab, compass.index, frames));
    },
    updatePickingCompass(frameIndex, stringIndex, value) {
      setTab(updatePickingCompass(tab, compass.index, frameIndex, stringIndex, value));
    },
  });

  const toggleEditMode = () => {
    if (isEditMode) {
      props.updateTab(tab);
      setTab(resetEditIndex(tab));
    }
    setIsEditMode(!isEditMode);
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
      </div>

      <div
        className="compasses"
        style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%' }}
      >
        {tab.compasses.map((compass) => {
          const actualCompass =
            compass.type === 'reference'
              ? (tab.compasses.find((c) => c.index === compass.reference) as
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
              editIndex={tab.editIndex}
              handlers={getHandlers(compass)}
              isEditMode={isEditMode}
              key={compass.index}
              width={compassWidth}
            />
          );
        })}

        {isEditMode && (
          <AddCompass
            addCompass={addCompass}
            compassIndex={arrayIndexToCompassIndex(tab.compasses.length)}
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
    </div>
  );
};
