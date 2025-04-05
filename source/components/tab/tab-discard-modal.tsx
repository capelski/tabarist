import React, { useContext } from 'react';
import { ActionType, DispatchProvider } from '../../state';
import { Modal } from '../common/modal';

export const TabDiscardModal: React.FC = () => {
  const dispatch = useContext(DispatchProvider);

  const cancelDiscardChanges = () => {
    dispatch({ type: ActionType.discardChangesCancel });
  };

  const discardEditChanges = () => {
    dispatch({ type: ActionType.discardChangesConfirm, navigate: { back: true } });
  };

  return (
    <Modal closeHandler={cancelDiscardChanges} hideCloseButton={true}>
      <p>Do you want to discard the unsaved changes?</p>
      <div>
        <button
          className="btn btn-danger"
          onClick={discardEditChanges}
          style={{ marginRight: 8 }}
          type="button"
        >
          Discard
        </button>
        <button className="btn btn-outline-secondary" onClick={cancelDiscardChanges} type="button">
          Cancel
        </button>
      </div>
    </Modal>
  );
};
