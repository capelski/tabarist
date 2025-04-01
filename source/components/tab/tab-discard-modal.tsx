import React from 'react';
import { Modal } from '../common/modal';

export type TabDiscardModalProps = {
  discardEditChanges: () => void;
  keepEditChanges: () => void;
};

export const TabDiscardModal: React.FC<TabDiscardModalProps> = (props) => {
  return (
    <Modal closeHandler={props.keepEditChanges} hideCloseButton={true}>
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
        <button className="btn btn-outline-secondary" onClick={props.keepEditChanges} type="button">
          Cancel
        </button>
      </div>
    </Modal>
  );
};
