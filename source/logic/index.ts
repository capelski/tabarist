import { Compass, Frame, Tab } from '../types';

export const createCompass = (): Compass => Array.from({ length: 8 }, createFrame);

export const createFrame = (): Frame => ['', '', '', '', '', ''];

export const createTab = (): Tab => ({
  compasses: [createCompass()],
  title: 'Unnamed tab',
});
