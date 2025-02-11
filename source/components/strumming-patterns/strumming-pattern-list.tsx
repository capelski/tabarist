import React from 'react';
import { addSymbol } from '../../constants';
import { sPatternOperations, tabOperations } from '../../operations';
import { Tab } from '../../types';
import { StrummingPatternComponent } from './strumming-pattern';

export type StrummingPatternListProps = {
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const StrummingPatternList: React.FC<StrummingPatternListProps> = (props) => {
  const addStrummingPattern = () => {
    props.updateTab(tabOperations.addStrummingPattern(props.tab));
  };

  return (
    <React.Fragment>
      <h3>Strumming patterns</h3>

      {props.tab.strummingPatterns.map((sPattern) => {
        return (
          <StrummingPatternComponent
            key={sPattern.index}
            rebase={(framesNumber) => {
              props.updateTab(sPatternOperations.rebase(props.tab, sPattern.index, framesNumber));
            }}
            strummingPattern={sPattern}
            tab={props.tab}
            update={(frameIndex, value) => {
              props.updateTab(
                sPatternOperations.update(props.tab, sPattern.index, frameIndex, value),
              );
            }}
            updateTab={props.updateTab}
          />
        );
      })}

      <p>
        <button onClick={addStrummingPattern} type="button">
          {addSymbol} strumming pattern
        </button>
      </p>
    </React.Fragment>
  );
};
