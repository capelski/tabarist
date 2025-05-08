import { Before } from '@cucumber/cucumber';
import { Tab } from './types';

export type TestGlobals = {
  tabs: { [key: string]: Tab };
};

export const globals = {} as TestGlobals;

Before(() => {
  globals.tabs = {};
});
