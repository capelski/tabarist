export enum BarType {
  chord = 'chord',
  picking = 'picking',
  reference = 'reference',
  section = 'section',
}

export type NonReferenceBarType = BarType.chord | BarType.picking | BarType.section;
