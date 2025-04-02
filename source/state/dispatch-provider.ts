import { createContext, Dispatch } from 'react';
import { AppAction } from './app-action';

export const DispatchProvider = createContext<Dispatch<AppAction>>(undefined!);
