import React, { useEffect, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router';
import { App, AppPropsBase } from './app';

const AppWithRouter: React.FC<AppPropsBase> = (props) => {
  const [initialState, setInitialState] = useState<AppPropsBase | undefined>(props);

  useEffect(() => {
    // After first render, clear the state so components re-fetch data when needed
    // Otherwise, the same data will be used through out the page lifespan
    setInitialState(undefined);
  }, []);

  return (
    <BrowserRouter>
      <App {...initialState} isServerRendered={false} />
    </BrowserRouter>
  );
};

const container = document.getElementById('app-placeholder')!;
Modal.setAppElement(container);

if ('initialState' in window) {
  const initialState = window.initialState as AppPropsBase;
  hydrateRoot(container, <AppWithRouter {...initialState} />);
} else {
  // Used in development mode (i.e. npm run dev)
  const root = createRoot(container);
  root.render(<AppWithRouter />);
}
