import React, { useContext } from 'react';
import { tabRepository } from '../../repositories';
import { ActionType, StateProvider } from '../../state';
import { Tab } from '../../types';
import { Modal } from '../common/modal';

export type TabDeletionModalProps = {
  deletingTab?: Tab;
  onTabDeleted: () => void;
};

export const TabDeletionModal: React.FC<TabDeletionModalProps> = (props) => {
  const { dispatch } = useContext(StateProvider);

  const cancelDelete = () => {
    dispatch({ type: ActionType.deleteCancel });
  };

  const confirmDelete = async () => {
    await tabRepository.remove(props.deletingTab!.id);
    props.onTabDeleted();
  };

  return (
    props.deletingTab && (
      <Modal closeHandler={cancelDelete} hideCloseButton={true}>
        <p>
          Are you sure you want to delete <b>{props.deletingTab.title}</b>?
        </p>
        <div>
          <button
            className="btn btn-danger"
            onClick={confirmDelete}
            style={{ marginRight: 8 }}
            type="button"
          >
            Delete
          </button>
          <button className="btn btn-outline-secondary" onClick={cancelDelete} type="button">
            Cancel
          </button>
        </div>
      </Modal>
    )
  );
};
