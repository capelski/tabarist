import React, { PropsWithChildren } from 'react';
import { Modal } from './modal';

export const BlockingLoader: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <Modal>
      <div
        className="spinner-border text-primary"
        style={{ width: 200, height: 200 }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </Modal>
  );
};
