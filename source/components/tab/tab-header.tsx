import React, { MutableRefObject, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  editSymbol,
  queryParameters,
  removeSymbol,
  RouteNames,
  saveSymbol,
  ViewMode,
} from '../../constants';
import { User } from '../../firebase';
import { tabOperations } from '../../operations';
import { tabRepository } from '../../repositories';
import { Tab } from '../../types';
import { Modal } from '../common/modal';

export type TabHeaderProps = {
  areModesEquivalent: boolean;
  editingCopy: string;
  isEditMode: boolean;
  isTabOwner: boolean;
  playTimeoutRef: MutableRefObject<number>;
  tab: Tab;
  updateEditingCopy: (editingCopy: string) => void;
  updateTab: (tab: Tab) => void;
  updateViewMode: (viewMode: ViewMode) => void;
  user: User | null;
  viewMode: ViewMode;
};

export const TabHeader: React.FC<TabHeaderProps> = (props) => {
  const [deletingTab, setDeletingTab] = useState('');
  const [discardingChanges, setDiscardingChanges] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const cancelDelete = () => {
    setDeletingTab('');
  };

  const cancelExitEditMode = () => {
    setDiscardingChanges(false);
  };

  const confirmDelete = async () => {
    if (!props.isTabOwner) {
      return;
    }

    await tabRepository.remove(deletingTab);
    cancelDelete();
    navigate(RouteNames.myTabs);
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
    setDeletingTab(props.tab.id);
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
      {deletingTab && (
        <Modal closeHandler={cancelDelete}>
          <p>Are you sure you want to delete this tab?</p>
          <div>
            <button onClick={confirmDelete} style={{ marginRight: 8 }} type="button">
              Delete
            </button>
            <button onClick={cancelDelete} type="button">
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {discardingChanges && (
        <Modal closeHandler={cancelExitEditMode}>
          <p>Do you want to discard the unsaved changes?</p>
          <div>
            <button onClick={confirmExitEditMode} style={{ marginRight: 8 }} type="button">
              Yes
            </button>
            <button onClick={cancelExitEditMode} type="button">
              No
            </button>
          </div>
        </Modal>
      )}

      <div style={{ alignItems: 'center', display: 'flex' }}>
        <h3 style={{ flexGrow: 1 }}>
          {props.isEditMode ? (
            <input
              value={props.tab.title}
              onChange={(event) => {
                props.updateTab(tabOperations.updateTitle(props.tab, event.target.value));
              }}
              style={{
                fontSize: '1em', // Mimics <h3>
                width: '95%',
              }}
            />
          ) : (
            props.tab.title
          )}
        </h3>

        {props.isTabOwner && (
          <React.Fragment>
            {props.isEditMode ? (
              <React.Fragment>
                <button onClick={saveEditModeChanges} style={{ marginLeft: 8 }} type="button">
                  {saveSymbol}
                </button>
                <button onClick={exitEditMode} style={{ marginLeft: 8 }} type="button">
                  ❌
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button onClick={enterEditMode} style={{ marginLeft: 8 }} type="button">
                  {editSymbol}
                </button>
                <button onClick={removeTab} style={{ marginLeft: 8 }} type="button">
                  {removeSymbol}
                </button>
              </React.Fragment>
            )}
          </React.Fragment>
        )}

        {!props.areModesEquivalent && (
          <React.Fragment>
            <span style={{ marginLeft: 8 }}>👁️</span>
            <select
              onChange={(event) => {
                const nextViewMode = event.target.value as ViewMode;
                props.updateViewMode(nextViewMode);
              }}
              style={{ marginLeft: 8 }}
              value={props.viewMode}
            >
              {Object.values(ViewMode).map((viewMode) => {
                return (
                  <option key={viewMode} value={viewMode}>
                    {viewMode}
                  </option>
                );
              })}
            </select>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
