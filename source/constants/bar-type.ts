export enum BarType {
  chord = 'chord',
  picking = 'picking',
  reference = 'reference',
  section = 'section',
}

export type NonRefefenceBarType = BarType.chord | BarType.picking | BarType.section;
