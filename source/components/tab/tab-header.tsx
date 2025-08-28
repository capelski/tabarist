import { User } from 'firebase/auth';
import { nanoid } from 'nanoid';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { BeatEngine } from '../../classes';
import { editSymbol, newTabId, removeSymbol, saveSymbol } from '../../constants';
import { tabOperations } from '../../operations';
import { tabRepository } from '../../repositories';
import { ActionType, StateProvider } from '../../state';
import { Tab } from '../../types';
import { TabDeletionModal } from './tab-deletion-modal';
import { enterEditMode, exitEditMode } from './tab-utils';

export type TabHeaderProps = {
  beatEngine: BeatEngine;
  deletingTab?: Tab;
  isDirty?: boolean;
  isDraft?: boolean;
  isEditMode: boolean | undefined;
  starredTabId: string | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  user: User | null;
};

export const TabHeader: React.FC<TabHeaderProps> = (props) => {
  const { dispatch } = useContext(StateProvider);
  const navigate = useNavigate();
  const isTabOwner = !!props.user && props.user.uid === props.tab.ownerId;

  const enterEditModeHandler = () => {
    if (!isTabOwner) {
      return;
    }

    props.beatEngine.stop();

    enterEditMode(props.tab.id, navigate);
  };

  const discardEditChanges = () => {
    exitEditMode(props.tab, props.isDirty, 'prompt', dispatch, navigate);
  };

  const saveEditChanges = async () => {
    if (!props.user) {
      return;
    }

    const savedTab = props.tab.id === newTabId ? { ...props.tab, id: nanoid() } : props.tab;
    await tabRepository.set(savedTab, props.user.uid);

    exitEditMode(savedTab, props.isDirty, 'save', dispatch, navigate);
  };

  const removeTab = () => {
    dispatch({ type: ActionType.deletePrompt, tab: props.tab });
  };

  return (
    <div className="tab-header">
      <TabDeletionModal
        deletingTab={props.deletingTab}
        onTabDeleted={() => {
          dispatch({
            type: ActionType.deleteConfirm,
          });
        }}
      />

      <div className="mb-3" style={{ alignItems: 'center', display: 'flex' }}>
        {props.isEditMode ? (
          <div className="input-group ">
            <span className="input-group-text">Title</span>
            <input
              className="form-control"
              onChange={(event) => {
                props.updateTab(tabOperations.updateTitle(props.tab, event.target.value));
              }}
              value={props.tab.title}
            />
          </div>
        ) : (
          <h3 style={{ flexGrow: 1 }}>{props.tab.title}</h3>
        )}

        {isTabOwner && (
          <React.Fragment>
            {props.isEditMode ? (
              <React.Fragment>
                <button
                  className="btn btn-outline-success"
                  onClick={saveEditChanges}
                  style={{ marginLeft: 8 }}
                  type="button"
                >
                  {saveSymbol}
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={discardEditChanges}
                  style={{ marginLeft: 8 }}
                  type="button"
                >
                  ❌
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button
                  className="btn btn-outline-primary"
                  onClick={enterEditModeHandler}
                  style={{ marginLeft: 8 }}
                  type="button"
                >
                  {editSymbol}
                </button>
                <button
                  className="btn btn-outline-danger"
                  disabled={!!props.isDraft}
                  onClick={removeTab}
                  style={{ marginLeft: 8 }}
                  type="button"
                >
                  {removeSymbol}
                </button>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
