import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { addCompassSymbol, stringHeight } from '../constants';
import {
  addCompassToTab,
  arrayIndexToCompassIndex,
  createCompass,
  createCompassReference,
  removeCompassFromTab,
  resetEditIndex,
  setEditIndex,
  updateCompass,
  updateTitle,
} from '../logic';
import { Compass, CompassReference, Tab } from '../types';
import { CompassComponent, CompassProps } from './compass';

export type TabProps = {
  tab: Tab;
};

export const TabComponent: React.FC<TabProps> = (props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tab, setTab] = useState<Tab>(props.tab);

  const isBigScreen = useMediaQuery({ minWidth: 1000 });
  const isMediumScreen = useMediaQuery({ minWidth: 600 });
  const compassWidth = isBigScreen ? 25 : isMediumScreen ? 50 : 100;

  const addCompass = (compass: Compass | CompassReference) => {
    setTab(addCompassToTab(tab, compass));
  };

  const getHandlers = (compassIndex: number): CompassProps['handlers'] => ({
    addCompassBefore() {
      addCompass(createCompass(compassIndex));
    },
    copyCompass() {
      addCompass(createCompassReference(compassIndex));
    },
    editCompass() {
      setTab(setEditIndex(tab, compassIndex));
    },
    editCompassFinish() {
      setTab(resetEditIndex(tab));
    },
    removeCompass() {
      setTab(removeCompassFromTab(tab, compassIndex));
    },
    updateCompass(frameIndex, stringIndex, value) {
      setTab(updateCompass(tab, compassIndex, frameIndex, stringIndex, value));
    },
  });

  const toggleEditMode = () => {
    if (isEditMode) {
      setTab(resetEditIndex(tab));
    }
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="tab">
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <div style={{ marginRight: 8 }}>
          <button onClick={toggleEditMode} type="button">
            {isEditMode ? '✅' : '🔧'}
          </button>
        </div>
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
      </div>

      <div
        className="compasses"
        style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%' }}
      >
        {tab.compasses.map((compass) => {
          const actualCompass =
            compass.type === 'compass'
              ? compass
              : (tab.compasses.find((c) => c.index === compass.reference) as Compass);

          return (
            <CompassComponent
              backgroundColor={
                actualCompass.index !== compass.index && isEditMode ? '#ddd' : 'white'
              }
              compass={actualCompass}
              currentIndex={compass.index}
              editIndex={tab.editIndex}
              handlers={getHandlers(compass.index)}
              isEditMode={isEditMode}
              key={compass.index}
              width={compassWidth}
            />
          );
        })}
        {isEditMode && (
          <div
            className="add-compass"
            style={{
              boxSizing: 'border-box',
              flexBasis: `${compassWidth}%`,
              height: stringHeight * 6,
              padding: '0 8px',
            }}
          >
            <div
              onClick={() => {
                addCompass(createCompass(arrayIndexToCompassIndex(tab.compasses.length)));
              }}
              style={{
                alignItems: 'center',
                backgroundColor: '#eee',
                cursor: 'pointer',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
              }}
            >
              {addCompassSymbol}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
