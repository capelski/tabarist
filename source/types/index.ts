export type String = string | undefined;

export type Frame = String[];

export type Compass = Frame[];

export type Tab = {
  compasses: Compass[];
  title: string;
};
