import React from 'react';
import { tabRepository } from '../../repositories';
import { Modal } from '../common/modal';

export type TabDeletionModalProps = {
  afterDeletion?: () => void;
  cancelDelete: () => void;
  tabId: string;
};

export const TabDeletionModal: React.FC<TabDeletionModalProps> = (props) => {
  const confirmDelete = async () => {
    await tabRepository.remove(props.tabId);
    props.cancelDelete();

    if (props.afterDeletion) {
      props.afterDeletion();
    }
  };

  return (
    props.tabId && (
      <Modal closeHandler={props.cancelDelete} hideCloseButton={true}>
        <p>Are you sure you want to delete this tab?</p>
        <div>
          <button
            className="btn btn-danger"
            onClick={confirmDelete}
            style={{ marginRight: 8 }}
            type="button"
          >
            Delete
          </button>
          <button className="btn btn-outline-secondary" onClick={props.cancelDelete} type="button">
            Cancel
          </button>
        </div>
      </Modal>
    )
  );
};
