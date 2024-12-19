import React, { useState } from 'react';
import { editingCompassDefault } from '../constants';
import { getNewTab } from '../logic';
import { Tab } from '../types';
import { CompassComponent, CompassProps } from './compass';

export const App: React.FC = () => {
  const [editingCompass, setEditingCompass] = useState(editingCompassDefault);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tab, setTab] = useState<Tab>(getNewTab);

  const getHandlers = (compassIndex: number): CompassProps['handlers'] => ({
    clearCompass() {
      setTab({
        compasses: tab.compasses.map((compass, cIndex) => {
          return cIndex !== compassIndex
            ? compass
            : compass.map((frame) => {
                return [...frame].map((_) => {
                  return '';
                });
              });
        }),
        title: tab.title,
      });
    },
    copyCompass(position) {
      const sourceCompass = tab.compasses[compassIndex];
      const nextCompasses = [...tab.compasses];
      nextCompasses.splice(
        compassIndex + (position === 'before' ? 0 : 1),
        0,
        sourceCompass.map((frame) => [...frame].map((_) => _)),
      );
      setTab({ compasses: nextCompasses, title: tab.title });

      if (editingCompass !== editingCompassDefault) {
        const nextEditingCompass = position === 'before' ? editingCompass + 1 : editingCompass;
        setEditingCompass(nextEditingCompass);
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
            />
          );
        })}
      </div>
    </div>
  );
};
