import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router';
import { App, AppProps } from './app';

const AppWithRouter: React.FC<AppProps> = (props) => {
  return (
    <BrowserRouter>
      <App {...props} />
    </BrowserRouter>
  );
};

const container = document.getElementById('app-placeholder')!;
Modal.setAppElement(container);
Modal.defaultStyles = {
  ...Modal.defaultStyles,
  overlay: {
    ...Modal.defaultStyles.overlay,
    zIndex: 10, // Necessary since Bootstrap buttons have zIndex: 2 inside input groups
  },
};

if ('initialState' in window) {
  const initialState = window.initialState as AppProps;
  hydrateRoot(container, <AppWithRouter {...initialState} />);
} else {
  // Used in development mode (i.e. npm run dev)
  const root = createRoot(container);
  root.render(<AppWithRouter />);
}
