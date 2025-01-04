import { BarType } from '../constants';
import { ChordBar, PickingBar, ReferenceBar, StrummingPattern } from '../types';
import { CommonCoreProps } from './bar-commons';
import { getChordBarCore } from './chord-bar-core';
import { getPickingBarCore } from './picking-bar-core';

export type ReferenceBarCoreProps = CommonCoreProps & {
  bar: ReferenceBar;
  referencedBar: ChordBar | PickingBar;
  strummingPatterns: StrummingPattern[];
};

export const getReferenceBarCore = (props: ReferenceBarCoreProps) => {
  return props.referencedBar.type === BarType.chord
    ? getChordBarCore({
        ...props,
        bar: props.referencedBar,
        disabled: true,
      })
    : getPickingBarCore({
        ...props,
        bar: props.referencedBar,
        disabled: true,
      });
};
