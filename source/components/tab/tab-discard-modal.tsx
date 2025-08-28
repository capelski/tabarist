import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { ActionType, StateProvider } from '../../state';
import { Modal } from '../common/modal';
import { exitEditMode } from './tab-utils';

export const TabDiscardModal: React.FC = () => {
  const { dispatch, state } = useContext(StateProvider);
  const navigate = useNavigate();

  const cancelDiscardChanges = () => {
    dispatch({ type: ActionType.discardChangesCancel });
  };

  const discardEditChanges = () => {
    exitEditMode(state.tab.document!, state.tab.isDirty, 'discard', dispatch, navigate);
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
