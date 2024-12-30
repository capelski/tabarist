import { BarType } from '../constants';
import { ChordBar, PickingBar, ReferenceBar, StrummingPattern } from '../types';
import { getChordBarCore } from './chord-bar-core';
import { getPickingBarCore } from './picking-bar-core';

export interface ReferenceBarCoreProps {
  backgroundColor: string;
  bar: ReferenceBar;
  borderLeft?: string;
  isEditMode: boolean;
  referencedBar: ChordBar | PickingBar;
  strummingPatterns: StrummingPattern[];
}

export const getReferenceBarCore = (props: ReferenceBarCoreProps) => {
  const baseProps = {
    ...props,
    disabled: true,
  };

  return props.referencedBar.type === BarType.chord
    ? getChordBarCore({
        ...baseProps,
        bar: props.referencedBar,
        strummingPatterns: props.strummingPatterns,
      })
    : getPickingBarCore({
        ...baseProps,
        bar: props.referencedBar,
      });
};
