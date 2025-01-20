import React from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { App } from './app';

const container = document.getElementById('app-placeholder')!;
const root = createRoot(container);
Modal.setAppElement(container);

root.render(<App />);
