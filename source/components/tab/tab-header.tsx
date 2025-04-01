import React, { MutableRefObject, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { editSymbol, QueryParameters, removeSymbol, RouteNames, saveSymbol } from '../../constants';
import { tabOperations } from '../../operations';
import { Tab } from '../../types';
import { TabDeletionModal } from './tab-deletion-modal';

export type TabHeaderProps = {
  existsInServer: boolean;
  isEditMode: boolean;
  isTabOwner: boolean;
  playTimeoutRef: MutableRefObject<number>;
  promptDiscardChanges: () => void;
  saveEditChanges: () => void;
  tab: Tab;
  updateTab: (tab: Tab, options?: { setExists?: boolean; setOriginal?: boolean }) => void;
};

export const TabHeader: React.FC<TabHeaderProps> = (props) => {
  const [deletingTabId, setDeletingTabId] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const cancelDelete = () => {
    setDeletingTabId('');
  };

  const enterEditMode = () => {
    if (!props.isTabOwner) {
      return;
    }

    clearTimeout(props.playTimeoutRef.current);

    const nextTab = tabOperations.resetActiveSlot(props.tab);
    props.updateTab(nextTab, { setOriginal: true });

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(QueryParameters.editMode, 'true');
    setSearchParams(nextSearchParams);
  };

  const removeTab = () => {
    setDeletingTabId(props.tab.id);
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
                  onClick={props.saveEditChanges}
                  style={{ marginLeft: 8 }}
                  type="button"
                >
                  {saveSymbol}
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={props.promptDiscardChanges}
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
                {props.existsInServer && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={removeTab}
                    style={{ marginLeft: 8 }}
                    type="button"
                  >
                    {removeSymbol}
                  </button>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
