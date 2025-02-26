import React from 'react';
import { addSymbol } from '../../constants';
import { tabOperations } from '../../operations';
import { Tab } from '../../types';
import { RhythmComponent } from './rhythm';

export type RhythmListProps = {
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const RhythmList: React.FC<RhythmListProps> = (props) => {
  const addRhythm = () => {
    props.updateTab(tabOperations.addRhythm(props.tab));
  };

  return (
    <div className="rhythm-list">
      <h3>Rhythms</h3>

      {props.tab.rhythms.map((rhythm) => {
        return (
          <RhythmComponent
            key={rhythm.index}
            rhythm={rhythm}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        );
      })}

      <p>
        <button onClick={addRhythm} type="button">
          {addSymbol} rhythm
        </button>
      </p>
    </div>
  );
};
