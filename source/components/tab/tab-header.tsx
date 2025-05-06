import { User } from 'firebase/auth';
import React, { MutableRefObject, useContext } from 'react';
import { editSymbol, removeSymbol, RouteNames, saveSymbol } from '../../constants';
import { getTabRelativeUrl, tabOperations } from '../../operations';
import { tabRepository } from '../../repositories';
import { ActionType, StateProvider } from '../../state';
import { Tab } from '../../types';
import { TabDeletionModal } from './tab-deletion-modal';

export type TabHeaderProps = {
  deletingTab?: Tab;
  isDirty?: boolean;
  isDraft?: boolean;
  isEditMode: boolean;
  playTimeoutRef: MutableRefObject<number>;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  user: User | null;
};

export const TabHeader: React.FC<TabHeaderProps> = (props) => {
  const { dispatch } = useContext(StateProvider);
  const isTabOwner = !!props.user && props.user.uid === props.tab.ownerId;

  const enterEditMode = () => {
    if (!isTabOwner) {
      return;
    }

    clearTimeout(props.playTimeoutRef.current);

    dispatch({
      type: ActionType.enterEditMode,
      navigate: { to: [getTabRelativeUrl(props.tab.id, true)] },
    });
  };

  const saveEditChanges = async () => {
    if (!props.user) {
      return;
    }

    await tabRepository.set(props.tab, props.user.uid);

    dispatch({ type: ActionType.setTab, tab: props.tab, navigate: { back: true } });
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
            navigate: window.history.length > 0 ? { back: true } : { to: [RouteNames.myTabs] },
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
                  onClick={() => {
                    if (props.isDirty) {
                      dispatch({ type: ActionType.discardChangesPrompt });
                    } else {
                      dispatch({
                        type: ActionType.discardChangesConfirm,
                        navigate: { back: true },
                      });
                    }
                  }}
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
                  onClick={enterEditMode}
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
