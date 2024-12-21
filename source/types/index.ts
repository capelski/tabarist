export type ChordCompass = CompassBase & {
  frames: string[];
  framesNumber: number;
  type: 'chord';
};

export type Compass = ChordCompass | CompassReference | PickingCompass;

export type CompassBase = { index: number };

export type CompassReference = CompassBase & {
  reference: number;
  type: 'reference';
};

export type PickingCompass = CompassBase & {
  frames: PickingFrame[];
  framesNumber: number;
  type: 'picking';
};

export type PickingFrame = string[];

export type Tab = {
  compasses: Compass[];
  editIndex: number;
  id: string;
  title: string;
};

export type TabRegistry = {
  [id: string]: string;
};
