import React, { useContext } from 'react';
import { ActionType, DispatchProvider } from '../../state';
import { Modal } from '../common/modal';

export type TabDiscardModalProps = {
  discardEditChanges: () => void;
};

export const TabDiscardModal: React.FC<TabDiscardModalProps> = (props) => {
  const dispatch = useContext(DispatchProvider);

  const cancelDiscardChanges = () => {
    dispatch({ type: ActionType.discardChangesCancel });
  };

  return (
    <Modal closeHandler={cancelDiscardChanges} hideCloseButton={true}>
      <p>Do you want to discard the unsaved changes?</p>
      <div>
        <button
          className="btn btn-danger"
          onClick={props.discardEditChanges}
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
