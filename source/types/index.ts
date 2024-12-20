export type Frame = string[];

export type Compass = CompassReference | PickingCompass;

export type CompassBase = { index: number };

export type CompassReference = CompassBase & {
  reference: number;
  type: 'reference';
};

export type PickingCompass = CompassBase & {
  frames: Frame[];
  framesNumber: number;
  type: 'compass';
};

export type Tab = {
  compasses: Compass[];
  editIndex: number;
  id: string;
  title: string;
};

export type TabRegistry = {
  [id: string]: string;
};
