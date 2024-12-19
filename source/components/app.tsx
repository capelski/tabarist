import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { addCompassSymbol, editingCompassDefault, stringHeight } from '../constants';
import { createCompass, createTab } from '../logic';
import { Tab } from '../types';
import { CompassComponent, CompassProps } from './compass';

export const App: React.FC = () => {
  const [editingCompass, setEditingCompass] = useState(editingCompassDefault);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tab, setTab] = useState<Tab>(createTab);

  const isBigScreen = useMediaQuery({ minWidth: 1000 });
  const isMediumScreen = useMediaQuery({ minWidth: 600 });
  const compassWidth = isBigScreen ? 25 : isMediumScreen ? 50 : 100;

  const addCompass = (index: number) => {
    const nextCompasses = [...tab.compasses];
    nextCompasses.splice(index, 0, createCompass());
    setTab({ compasses: nextCompasses, title: tab.title });
  };

  const getHandlers = (compassIndex: number): CompassProps['handlers'] => ({
    addCompassBefore() {
      addCompass(compassIndex);

      if (compassIndex < editingCompass && editingCompass !== editingCompassDefault) {
        setEditingCompass(editingCompass + 1);
      }
    },
    editCompass() {
      setEditingCompass(compassIndex);
    },
    editCompassFinish() {
      setEditingCompass(editingCompassDefault);
    },
    removeCompass() {
      const nextCompasses = tab.compasses.filter((_, cIndex) => cIndex !== compassIndex);
      setTab({ compasses: nextCompasses, title: tab.title });

      if (editingCompass === compassIndex) {
        setEditingCompass(editingCompassDefault);
      } else if (compassIndex < editingCompass && editingCompass !== editingCompassDefault) {
        setEditingCompass(editingCompass - 1);
      }
    },
    updateCompass(frameIndex, stringIndex, value) {
      setTab({
        compasses: tab.compasses.map((compass, cIndex) => {
          return cIndex !== compassIndex
            ? compass
            : compass.map((frame, fIndex) => {
                return fIndex !== frameIndex
                  ? frame
                  : [...frame].map((string, sIndex) => {
                      return sIndex !== stringIndex ? string : value;
                    });
              });
        }),
        title: tab.title,
      });
    },
  });

  const toggleEditMode = () => {
    if (isEditMode) {
      setEditingCompass(editingCompassDefault);
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
                setTab({ compasses: tab.compasses, title: event.target.value });
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
        {tab.compasses.map((compass, compassIndex) => {
          return (
            <CompassComponent
              key={compassIndex}
              compass={compass}
              compassIndex={compassIndex}
              editingCompass={editingCompass}
              handlers={getHandlers(compassIndex)}
              isEditMode={isEditMode}
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
                addCompass(tab.compasses.length);
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
