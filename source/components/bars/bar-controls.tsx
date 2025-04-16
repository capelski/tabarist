import React from 'react';
import { BarType, cancelSymbol, optionsSymbol } from '../../constants';
import { tabOperations } from '../../operations';
import { BarContainer, SectionBar, Tab } from '../../types';
import { AddBar } from './add-bar';
import { BarDestination } from './bar-destination';
import { getPositionOperationConditions } from './bar-handlers';

export type BarControlsProps = {
  barIndex: number;
  container: BarContainer;
  parentSection: SectionBar | undefined;
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
      props.container.originalIndex,
      props.container.parentSection?.index,
    );
    props.updateTab(nextTab);
  };

  const moveBarStart = () => {
    const nextTab = tabOperations.moveBarStart(
      props.tab,
      props.container.originalIndex,
      props.container.parentSection?.index,
    );
    props.updateTab(nextTab);
  };

  const removeBar = () => {
    const nextTab = tabOperations.removeBar(
      props.tab,
      props.container.originalIndex,
      props.container.parentSection,
    );
    props.updateTab(nextTab);
  };

  const {
    positionOperation,
    positionOperationApplicable,
    isPositionSource,
    isValidPositionTarget,
  } = getPositionOperationConditions(props.tab, props.container.originalIndex, props.parentSection);

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
      <span style={{ marginRight: 8 }}>{props.container.displayIndex}</span>

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
              parentSection={props.parentSection}
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
            barIndex={props.container.originalBar.type === BarType.section ? 0 : props.barIndex + 1}
            isSectionBar={props.container.originalBar.type === BarType.section}
            parentSection={
              props.container.originalBar.type === BarType.section
                ? props.container.originalBar
                : props.parentSection
            }
            tab={props.tab}
            updateTab={props.updateTab}
          />
        </React.Fragment>
      )}
    </div>
  );
};
