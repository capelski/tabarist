import React, { useState } from 'react';
import { cancelSymbol, ContainerType, optionsSymbol } from '../../constants';
import { tabOperations } from '../../operations';
import { BarContainer, Tab } from '../../types';
import { Modal } from '../common/modal';
import { AddBar } from './add-bar';
import { BarDestination } from './bar-destination';
import { getPositionOperationConditions } from './bar-handlers';
import { ChordBarComponent } from './chord-bar';
import { PickingBarComponent } from './picking-bar';

export type BarControlsProps = {
  container: BarContainer;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarControls: React.FC<BarControlsProps> = (props) => {
  const [timeDivisionsModal, setTimeDivisionsModal] = useState(false);

  const cancelPositionOperation = () => {
    const nextTab = tabOperations.cancelPositionOperation(props.tab);
    props.updateTab(nextTab);
  };

  const cancelTimeDivisions = () => {
    setTimeDivisionsModal(false);
  };

  const copyBarStart = () => {
    const nextTab = tabOperations.copyBarStart(
      props.tab,
      props.container.barIndex,
      props.container.parentSection?.index,
    );
    props.updateTab(nextTab);
  };

  const moveBarStart = () => {
    const nextTab = tabOperations.moveBarStart(
      props.tab,
      props.container.barIndex,
      props.container.parentSection?.index,
    );
    props.updateTab(nextTab);
  };

  const removeBar = () => {
    const nextTab = tabOperations.removeBar(
      props.tab,
      props.container.barIndex,
      props.container.parentSection,
    );
    props.updateTab(nextTab);
  };

  const {
    positionOperation,
    positionOperationApplicable,
    isPositionSource,
    isValidPositionTarget,
  } = getPositionOperationConditions(
    props.tab,
    props.container.barIndex,
    props.container.parentSection,
  );

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
      {timeDivisionsModal && (
        <Modal closeHandler={cancelTimeDivisions}>
          {props.container.type === ContainerType.chord && (
            <ChordBarComponent
              {...props}
              activeSlot={undefined}
              container={props.container as BarContainer<ContainerType.chord>}
              displayRhythmPicker={true}
              isEditMode={true}
            />
          )}

          {props.container.type === ContainerType.picking && (
            <PickingBarComponent
              {...props}
              activeSlot={undefined}
              container={props.container as BarContainer<ContainerType.picking>}
              displaySlotDivider={true}
              isEditMode={true}
            />
          )}
        </Modal>
      )}

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
              barIndex={props.container.barIndex}
              parentSection={props.container.parentSection}
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
            {(props.container.type === ContainerType.chord ||
              props.container.type === ContainerType.picking) && (
              <React.Fragment>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      setTimeDivisionsModal(true);
                    }}
                  >
                    Time divisions
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
              </React.Fragment>
            )}
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
            barIndex={props.container.isParent ? 0 : props.container.barIndex + 1}
            parentSection={props.container.addToParent}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        </React.Fragment>
      )}
    </div>
  );
};
