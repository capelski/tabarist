import { BarType } from '../constants';
import {
  ChordBar,
  PickingBar,
  ReferenceBar,
  Section,
  SectionBar,
  StrummingPattern,
} from '../types';
import { CommonCoreProps, CoreComponent } from './bar-commons';
import { getChordBarCore } from './chord-bar-core';
import { getPickingBarCore } from './picking-bar-core';
import { getSectionBarCore } from './section-bar-core';

export type ReferenceBarCoreProps = CommonCoreProps & {
  bar: ReferenceBar;
  referencedBar: ChordBar | PickingBar | SectionBar;
  section?: Section;
  strummingPatterns: StrummingPattern[];
};

export const getReferenceBarCore = (props: ReferenceBarCoreProps): CoreComponent[] => {
  return props.referencedBar.type === BarType.chord
    ? [
        getChordBarCore({
          ...props,
          bar: props.referencedBar,
          disabled: true,
        }),
      ]
    : props.referencedBar.type === BarType.picking
    ? [
        getPickingBarCore({
          ...props,
          bar: props.referencedBar,
          disabled: true,
        }),
      ]
    : props.section
    ? getSectionBarCore({
        ...props,
        bar: props.referencedBar,
        section: props.section,
      })
    : [];
};
