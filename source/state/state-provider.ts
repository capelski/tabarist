import { createContext, Dispatch } from 'react';
import { AppAction } from './app-action';
import { AppState } from './app-state';

export const StateProvider = createContext<{ dispatch: Dispatch<AppAction>; state: AppState }>(
  undefined!,
);
