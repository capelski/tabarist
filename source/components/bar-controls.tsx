import React from 'react';
import { BarType, cancelSymbol, moveStartSymbol, removeSymbol } from '../constants';
import { getIndexDisplayValue, sectionOperations, tabOperations } from '../operations';
import { BarContainer, Section, Tab } from '../types';
import { DivisionsPicker, DivisionsPickerProps } from './divisions-picker';
import { PatternPicker, PatternPickerProps } from './pattern-picker';

export type BarControlsProps = {
  canRebase: boolean;
  container: BarContainer;
  inSection: Section | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarControls: React.FC<BarControlsProps> = (props) => {
  const cancelPositionOperation = () => {
    const nextTab = tabOperations.cancelPositionOperation(props.tab);
    props.updateTab(nextTab);
  };

  const copyBarStart = () => {
    const nextTab = tabOperations.copyBarStart(
      props.tab,
      props.container.originalBar.index,
      props.container.inSection?.index,
    );
    props.updateTab(nextTab);
  };

  const moveBarStart = () => {
    const nextTab = tabOperations.moveBarStart(
      props.tab,
      props.container.originalBar.index,
      props.container.inSection?.index,
    );
    props.updateTab(nextTab);
  };

  const rebaseChord: PatternPickerProps['rebase'] = (sPatternIndex) => {
    const nextTab = tabOperations.rebaseChordBar(
      props.tab,
      props.container.originalBar.index,
      sPatternIndex,
      props.container.inSection,
    );
    props.updateTab(nextTab);
  };

  const rebasePicking: DivisionsPickerProps['rebase'] = (framesNumber) => {
    const nextTab = tabOperations.rebasePickingBar(
      props.tab,
      props.container.originalBar.index,
      framesNumber,
      props.container.inSection,
    );
    props.updateTab(nextTab);
  };

  const removeBar = () => {
    const nextTab = tabOperations.removeBar(
      props.tab,
      props.container.originalBar.index,
      props.container.inSection,
    );
    props.updateTab(nextTab);
  };

  return (
    <div
      className="bar-controls"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <span style={{ marginBottom: 16, marginRight: 8 }}>
        {getIndexDisplayValue(props.container.originalBar.index)}
        {props.container.originalBar.type === BarType.reference && (
          <span style={{ marginLeft: 8 }}>
            ={'>'} {getIndexDisplayValue(props.container.originalBar.barIndex)}
          </span>
        )}
      </span>

      {props.tab.moving &&
      sectionOperations.isOperationInSection(props.tab.moving, props.inSection) &&
      props.tab.moving.startIndex === props.container.originalBar.index ? (
        <button
          onClick={cancelPositionOperation}
          style={{ marginBottom: 16, marginRight: 8 }}
          type="button"
        >
          {cancelSymbol}
        </button>
      ) : (
        <button onClick={moveBarStart} style={{ marginBottom: 16, marginRight: 8 }} type="button">
          {moveStartSymbol}
        </button>
      )}

      {props.tab.copying &&
      sectionOperations.isOperationInSection(props.tab.copying, props.inSection) &&
      props.tab.copying.startIndex === props.container.originalBar.index ? (
        <button
          onClick={cancelPositionOperation}
          style={{ marginBottom: 16, marginRight: 8 }}
          type="button"
        >
          {cancelSymbol}
        </button>
      ) : (
        <button onClick={copyBarStart} style={{ marginBottom: 16, marginRight: 8 }} type="button">
          =
        </button>
      )}

      <button onClick={removeBar} style={{ marginBottom: 16 }} type="button">
        {removeSymbol}
      </button>

      <div style={{ display: 'inline-block', marginBottom: 16, marginLeft: 8 }}>
        {props.canRebase && (
          <div style={{ marginRight: 8, textAlign: 'center' }}>
            {props.container.originalBar.type === BarType.chord && (
              <PatternPicker
                rebase={rebaseChord}
                sPatternIndex={props.container.originalBar.sPatternIndex}
                strummingPatterns={props.tab.strummingPatterns}
              />
            )}
            {props.container.originalBar.type === BarType.picking && (
              <DivisionsPicker
                framesNumber={props.container.originalBar.framesNumber}
                rebase={rebasePicking}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
