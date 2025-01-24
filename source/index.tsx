import React from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { App } from './app';
import { bodyMargin } from './constants';

const container = document.getElementById('app-placeholder')!;
const root = createRoot(container);
Modal.setAppElement(container);

root.render(
  <div style={{ margin: bodyMargin }}>
    <App />
  </div>,
);
