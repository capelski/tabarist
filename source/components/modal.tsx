import React, { CSSProperties } from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  closeHandler?: () => void;
  children?: React.ReactNode;
  inset?: string;
  style?: CSSProperties;
}

export const Modal: React.FC<ModalProps> = (props) => {
  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        if (props.closeHandler) {
          props.closeHandler();
        }
      }}
    >
      <ReactModal
        isOpen={true}
        style={{
          content: {
            display: 'flex',
            flexDirection: 'column',
            inset: props.inset || '25% 20px',
            padding: 0,
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 8 }}
        >
          {props.closeHandler && (
            <div style={{ textAlign: 'right' }}>
              <span onClick={props.closeHandler} style={{ cursor: 'pointer' }}>
                ❌
              </span>
            </div>
          )}
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'center',
              ...props.style,
            }}
          >
            {props.children}
          </div>
        </div>
      </ReactModal>
    </div>
  );
};
