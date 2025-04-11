import React from 'react';
import { BarType, cancelSymbol, optionsSymbol } from '../../constants';
import { getIndexDisplayValue, tabOperations } from '../../operations';
import { BarContainer, Section, Tab } from '../../types';
import { AddBar } from './add-bar';
import { BarDestination } from './bar-destination';
import { getPositionOperationConditions } from './bar-handlers';

export type BarControlsProps = {
  barIndex: number;
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

  const removeBar = () => {
    const nextTab = tabOperations.removeBar(
      props.tab,
      props.container.originalBar.index,
      props.container.inSection,
    );
    props.updateTab(nextTab);
  };

  const {
    positionOperation,
    positionOperationApplicable,
    isPositionSource,
    isValidPositionTarget,
  } = getPositionOperationConditions(props.tab, props.container.originalBar.index, props.inSection);

  return (
    <div
      className="bar-controls"
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 8,
      }}
    >
      <span style={{ marginRight: 8 }}>
        {getIndexDisplayValue(props.container.originalBar.index)}
        {props.container.originalBar.type === BarType.reference && (
          <span>={getIndexDisplayValue(props.container.originalBar.barIndex)}</span>
        )}
      </span>

      {positionOperationApplicable &&
        (isPositionSource ? (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={cancelPositionOperation}
            type="button"
          >
            {cancelSymbol}
          </button>
        ) : (
          isValidPositionTarget && (
            <BarDestination
              barIndex={props.barIndex}
              inSection={props.inSection}
              tab={props.tab}
              updateTab={props.updateTab}
            />
          )
        ))}

      {!positionOperation && (
        <React.Fragment>
          <button
            aria-expanded="false"
            className="btn btn-sm btn-outline-success"
            data-bs-toggle="dropdown"
            style={{ marginRight: 8 }}
            type="button"
          >
            {optionsSymbol}
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" onClick={copyBarStart}>
                Copy
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={moveBarStart}>
                Move
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={removeBar}>
                Remove
              </a>
            </li>
          </ul>

          <AddBar
            barIndex={props.barIndex + 1}
            inSection={props.inSection}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        </React.Fragment>
      )}
    </div>
  );
};
