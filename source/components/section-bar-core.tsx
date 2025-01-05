import React from 'react';
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
import { getReferenceBarCore } from './reference-bar-core';
import { RepeatsProps } from './repeats';

export type SectionBarCoreProps = {
  bar: SectionBar;
  isEditMode: boolean;
  section: Section;
  strummingPatterns: StrummingPattern[];
  updateRepeats: RepeatsProps['updateRepeats'];
};

export const getSectionBarCore = (props: SectionBarCoreProps): CoreComponent[] => {
  return props.section.bars.length > 0
    ? props.section.bars
        .map((nonSectionBar) => {
          const baseProps: CommonCoreProps = {
            inSection: undefined,
            inSectionBar: props.bar,
            isEditMode: props.isEditMode,
            isFirstBarInSectionBar: nonSectionBar.index === 0,
            isLastBarInSectionBar: nonSectionBar.index === props.section.bars.length - 1,
            repeats: props.bar.repeats,
            sectionName: props.section.name,
            updateRepeats: props.updateRepeats,
          };

          return nonSectionBar.type === BarType.chord
            ? [
                getChordBarCore({
                  ...baseProps,
                  bar: nonSectionBar,
                  disabled: true,
                  strummingPatterns: props.strummingPatterns,
                }),
              ]
            : nonSectionBar.type === BarType.picking
            ? [
                getPickingBarCore({
                  ...baseProps,
                  bar: nonSectionBar,
                  disabled: true,
                }),
              ]
            : getReferenceBarCore({
                ...baseProps,
                bar: nonSectionBar,
                referencedBar: props.section.bars.find(
                  (b) => b.index === (nonSectionBar as ReferenceBar).barIndex,
                ) as ChordBar | PickingBar,
                strummingPatterns: props.strummingPatterns,
              });
        })
        .reduce((reduced, bars) => [...reduced, ...bars], [])
    : props.isEditMode
    ? [
        {
          coreComponent: (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'center',
              }}
            >
              Empty section
            </div>
          ),
        },
      ]
    : [];
};
