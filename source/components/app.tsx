import React, { useState } from 'react';
import { editingCompassDefault } from '../constants';
import { Compass } from '../types';
import { CompassComponent, CompassProps } from './compass';

export const App: React.FC = () => {
  const [editingCompass, setEditingCompass] = useState(editingCompassDefault);
  const [compasses, setCompasses] = useState<Compass[]>([
    [
      [, , , , '14', '12'],
      [, , , , '14', '12'],
      [, , , , '14', '12'],
      [, , , , '14', '12'],
      [, , , , '14', '12'],
      [, , , , '14', '12'],
      [, , , , '14', '12'],
      [, , , , '14', '12'],
    ],
    [
      [, , , , '12', '10'],
      [, , , , '12', '10'],
      [, , , , '12', '10'],
      [, , , , '12', '10'],
      [, , , , '12', '10'],
      [, , , , '12', '10'],
      [, , , , '12', '10'],
      [, , , , '12', '10'],
    ],
  ]);

  const getHandlers = (compassIndex: number): CompassProps['handlers'] => ({
    clearCompass() {
      setCompasses(
        compasses.map((compass, cIndex) => {
          return cIndex !== compassIndex
            ? compass
            : compass.map((frame) => {
                return [...frame].map((_) => {
                  return '';
                });
              });
        }),
      );
    },
    copyCompass(position) {
      const sourceCompass = compasses[compassIndex];
      const nextCompasses = [...compasses];
      nextCompasses.splice(
        compassIndex + (position === 'before' ? 0 : 1),
        0,
        sourceCompass.map((frame) => [...frame].map((_) => _)),
      );
      setCompasses(nextCompasses);

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
      const nextCompasses = compasses.filter((_, cIndex) => cIndex !== compassIndex);
      setCompasses(nextCompasses);

      if (editingCompass === compassIndex) {
        setEditingCompass(editingCompassDefault);
      } else if (compassIndex < editingCompass && editingCompass !== editingCompassDefault) {
        setEditingCompass(editingCompass - 1);
      }
    },
    updateCompass(frameIndex, stringIndex, value) {
      setCompasses(
        compasses.map((compass, cIndex) => {
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
      );
    },
  });

  return (
    <div
      className="tab"
      style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%' }}
    >
      {compasses.map((compass, compassIndex) => {
        return (
          <CompassComponent
            key={compassIndex}
            compass={compass}
            compassIndex={compassIndex}
            editingCompass={editingCompass}
            handlers={getHandlers(compassIndex)}
          />
        );
      })}
    </div>
  );
};
