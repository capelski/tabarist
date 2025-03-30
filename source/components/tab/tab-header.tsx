import { User } from 'firebase/auth';
import React, { MutableRefObject, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { editSymbol, queryParameters, removeSymbol, RouteNames, saveSymbol } from '../../constants';
import { tabOperations } from '../../operations';
import { tabRepository } from '../../repositories';
import { Tab } from '../../types';
import { Modal } from '../common/modal';
import { TabDeletionModal } from './tab-deletion-modal';

export type TabHeaderProps = {
  editingCopy: string;
  isEditMode: boolean;
  isTabOwner: boolean;
  playTimeoutRef: MutableRefObject<number>;
  tab: Tab;
  updateEditingCopy: (editingCopy: string) => void;
  updateTab: (tab: Tab) => void;
  user: User | null;
};

export const TabHeader: React.FC<TabHeaderProps> = (props) => {
  const [deletingTabId, setDeletingTabId] = useState('');
  const [discardingChanges, setDiscardingChanges] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const cancelDelete = () => {
    setDeletingTabId('');
  };

  const cancelExitEditMode = () => {
    setDiscardingChanges(false);
  };

  const confirmExitEditMode = () => {
    setDiscardingChanges(false);
    props.updateEditingCopy('');
    props.updateTab(JSON.parse(props.editingCopy));

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(queryParameters.editMode);
    setSearchParams(nextSearchParams);
  };

  const enterEditMode = () => {
    if (!props.isTabOwner) {
      return;
    }

    clearTimeout(props.playTimeoutRef.current);

    const nextTab = tabOperations.resetActiveSlot(props.tab);
    props.updateEditingCopy(JSON.stringify(nextTab));
    props.updateTab(nextTab);

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(queryParameters.editMode, 'true');
    setSearchParams(nextSearchParams);
  };

  const exitEditMode = () => {
    if (JSON.stringify(props.tab) === props.editingCopy) {
      confirmExitEditMode();
    } else {
      setDiscardingChanges(true);
    }
  };

  const removeTab = () => {
    setDeletingTabId(props.tab.id);
  };

  const saveEditModeChanges = async () => {
    await tabRepository.set(props.tab, props.user!.uid);

    props.updateEditingCopy('');

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(queryParameters.editMode);
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="tab-header">
      <TabDeletionModal
        afterDeletion={() => {
          navigate(RouteNames.myTabs);
        }}
        cancelDelete={cancelDelete}
        tabId={deletingTabId}
      />

      {discardingChanges && (
        <Modal closeHandler={cancelExitEditMode} hideCloseButton={true}>
          <p>Do you want to discard the unsaved changes?</p>
          <div>
            <button
              className="btn btn-danger"
              onClick={confirmExitEditMode}
              style={{ marginRight: 8 }}
              type="button"
            >
              Discard
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={cancelExitEditMode}
              type="button"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      <div className="mb-3" style={{ alignItems: 'center', display: 'flex' }}>
        {props.isEditMode ? (
          <div className="input-group">
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

        {props.isTabOwner && (
          <React.Fragment>
            {props.isEditMode ? (
              <React.Fragment>
                <button
                  className="btn btn-outline-success"
                  onClick={saveEditModeChanges}
                  style={{ marginLeft: 8 }}
                  type="button"
                >
                  {saveSymbol}
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={exitEditMode}
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
