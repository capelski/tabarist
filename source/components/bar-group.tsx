import React from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  AddBar,
  ChordBarComponent,
  ChordBarProps,
  PickingBarComponent,
  PickingBarProps,
} from '../components';
import { BarType, stringHeight } from '../constants';
import { Bar, ChordBar, PickingBar, StrummingPattern } from '../types';

export type BarGroupProps = {
  addBar: (index: number, type: BarType.chord | BarType.picking) => void;
  bars: Bar[];
  getChordBarHandlers: (bar: Bar) => ChordBarProps['handlers'];
  getPickingBarHandlers: (bar: Bar) => PickingBarProps['handlers'];
  isEditMode: boolean;
  strummingPatterns: StrummingPattern[];
};

export const BarGroup: React.FC<BarGroupProps> = (props) => {
  const isBigScreen = useMediaQuery({ minWidth: 1000 });
  const isMediumScreen = useMediaQuery({ minWidth: 600 });
  const barWidth = isBigScreen ? 25 : isMediumScreen ? 50 : 100;

  return (
    <div
      className="bars"
      style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%' }}
    >
      {props.bars.map((bar) => {
        const actualBar =
          bar.type === BarType.reference
            ? (props.bars.find((b) => b.index === bar.barIndex) as ChordBar | PickingBar)
            : bar;

        return actualBar.type === BarType.picking ? (
          <PickingBarComponent
            addBar={(type) => props.addBar(bar.index, type)}
            backgroundColor={actualBar.index !== bar.index && props.isEditMode ? '#ddd' : 'white'}
            bar={actualBar}
            currentIndex={bar.index}
            handlers={props.getPickingBarHandlers(bar)}
            isEditMode={props.isEditMode}
            key={bar.index}
            width={barWidth}
          />
        ) : (
          <ChordBarComponent
            addBar={(type) => props.addBar(bar.index, type)}
            backgroundColor={actualBar.index !== bar.index && props.isEditMode ? '#ddd' : 'white'}
            bar={actualBar}
            currentIndex={bar.index}
            handlers={props.getChordBarHandlers(bar)}
            isEditMode={props.isEditMode}
            key={bar.index}
            strummingPatterns={props.strummingPatterns}
            width={barWidth}
          />
        );
      })}

      {props.isEditMode && (
        <AddBar
          addBar={(type) => props.addBar(props.bars.length, type)}
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
  );
};
