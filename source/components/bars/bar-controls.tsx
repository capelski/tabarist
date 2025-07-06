import React, { useContext, useState } from 'react';
import { cancelSymbol, ContainerType, optionsSymbol } from '../../constants';
import { tabOperations } from '../../operations';
import { ActionType, StateProvider } from '../../state';
import { BarContainer, PositionOperation, Tab } from '../../types';
import { Modal } from '../common/modal';
import { AddBar } from './add-bar';
import { BarDestination } from './bar-destination';
import { TimeDivisionsComponent } from './time-divisions';

export type BarControlsProps = {
  container: BarContainer;
  positionOperation: PositionOperation | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarControls: React.FC<BarControlsProps> = (props) => {
  const [timeDivisionsModal, setTimeDivisionsModal] = useState(false);

  const { dispatch } = useContext(StateProvider);

  const cancelPositionOperation = () => {
    dispatch({ type: ActionType.positionOperationCancel });
  };

  const cancelTimeDivisions = () => {
    setTimeDivisionsModal(false);
  };

  const startPositionOperation = (type: 'copying' | 'moving') => {
    dispatch({
      type: ActionType.positionOperationStart,
      positionOperation: {
        sectionIndex: props.container.parentSection?.index,
        startIndex: props.container.barIndex,
        type,
      },
    });
  };

  const startSectionPositionOperation = (type: 'copying' | 'moving') => {
    if (props.container.parentIndex === undefined) {
      return;
    }

    dispatch({
      type: ActionType.positionOperationStart,
      positionOperation: {
        sectionIndex: undefined,
        startIndex: props.container.parentIndex,
        type,
      },
    });
  };

  const removeBar = () => {
    const nextTab = tabOperations.removeBar(
      props.tab,
      props.container.barIndex,
      props.container.parentSection,
    );
    props.updateTab(nextTab);
  };

  const removeSectionBar = () => {
    if (props.container.parentIndex === undefined) {
      return;
    }

    const nextTab = tabOperations.removeBar(props.tab, props.container.parentIndex, undefined);
    props.updateTab(nextTab);
  };

  return (
    <div
      className="bar-controls"
      style={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      }}
    >
      {timeDivisionsModal && (
        <Modal inset="10%" closeHandler={cancelTimeDivisions}>
          <TimeDivisionsComponent
            container={props.container as BarContainer<ContainerType.chord | ContainerType.picking>}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        </Modal>
      )}

      <span style={{ marginRight: 8 }}>{props.container.displayIndex}</span>

      {props.container.isOperationSource && (
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={cancelPositionOperation}
          type="button"
        >
          {cancelSymbol}
        </button>
      )}

      {props.container.isOperationTarget && (
        <BarDestination
          barIndex={props.container.destinationBarIndex!}
          parentSection={props.container.destinationParentSection!}
        />
      )}

      {!props.positionOperation && (
        <React.Fragment>
          <button
            aria-expanded="false"
            className="btn btn-sm btn-outline-success"
            data-bs-toggle="dropdown"
            style={{ marginRight: 8, paddingBottom: 0, paddingTop: 0 }}
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
              <a
                className="dropdown-item"
                onClick={() => {
                  startPositionOperation('copying');
                }}
              >
                Copy
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => {
                  startPositionOperation('moving');
                }}
              >
                Move
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={removeBar}>
                Remove
              </a>
            </li>

            {props.container.isFirstInSectionBar && (
              <React.Fragment>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      startSectionPositionOperation('copying');
                    }}
                  >
                    Copy section
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      startSectionPositionOperation('moving');
                    }}
                  >
                    Move section
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={removeSectionBar}>
                    Remove section
                  </a>
                </li>
              </React.Fragment>
            )}
          </ul>

          <AddBar
            addMode={props.container.addMode}
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
