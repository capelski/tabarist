export type Frame = string[];

export type CompassBase = { index: number };

export type Compass = CompassBase & {
  frames: Frame[];
  type: 'compass';
};

export type CompassReference = CompassBase & {
  reference: number;
  type: 'reference';
};

export type Tab = {
  compasses: (Compass | CompassReference)[];
  editIndex: number;
  id: string;
  title: string;
};

export type TabRegistry = {
  [id: string]: string;
};
