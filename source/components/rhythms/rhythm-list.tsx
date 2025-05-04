import React from 'react';
import { addSymbol, ContainerType } from '../../constants';
import { tabOperations } from '../../operations';
import { BarContainer, Rhythm, Tab } from '../../types';
import { RhythmComponent } from './rhythm';

export type RhythmListProps = {
  container: BarContainer<ContainerType.chord | ContainerType.picking>;
  selectedRhythmIndex: number;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const RhythmList: React.FC<RhythmListProps> = (props) => {
  const addRhythm = () => {
    props.updateTab(tabOperations.addRhythm(props.tab));
  };

  const setRhythm = (rhythm: Rhythm) => {
    const nextTab = tabOperations.setBarRhythm(
      props.tab,
      props.container.barIndex,
      rhythm,
      props.container.parentSection,
    );
    props.updateTab(nextTab);
  };

  return (
    <div className="rhythm-list">
      {props.tab.rhythms.map((rhythm) => {
        return (
          <RhythmComponent
            isSelected={rhythm.index === props.selectedRhythmIndex}
            key={rhythm.index}
            rhythm={rhythm}
            setRhythm={() => setRhythm(rhythm)}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        );
      })}

      <p>
        <button className="btn btn-outline-primary" onClick={addRhythm} type="button">
          {addSymbol} rhythm
        </button>
      </p>
    </div>
  );
};
