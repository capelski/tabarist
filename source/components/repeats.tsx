import React from 'react';
import { repeatsHeight } from '../constants';
import { SectionBar } from '../types';

export type RepeatsProps = {
  inSectionBar: SectionBar | undefined;
  isEditMode: boolean;
  isFirstBarInSectionBar: boolean;
  isLastBarInSectionBar: boolean;
  repeats: number | undefined;
  updateRepeats: ((repeats?: number) => void) | undefined;
};

export const Repeats: React.FC<RepeatsProps> = (props) => {
  const hasRepeats = props.repeats && props.repeats > 1;

  return (
    <div style={{ height: repeatsHeight }}>
      <div
        style={{
          backgroundColor:
            props.inSectionBar && (props.isEditMode || hasRepeats) ? 'lightgrey' : undefined,
          height: 20,
          marginRight: props.isLastBarInSectionBar ? 8 : undefined,
          paddingLeft: 8,
        }}
      >
        {(!props.inSectionBar || props.isFirstBarInSectionBar) &&
          (props.isEditMode ? (
            <React.Fragment>
              <input
                disabled={!props.updateRepeats}
                onChange={(event) => {
                  const nextRepeats = parseInt(event.target.value);
                  props.updateRepeats!(isNaN(nextRepeats) ? undefined : nextRepeats);
                }}
                style={{ boxSizing: 'border-box', marginRight: 4, maxHeight: 20, maxWidth: 30 }}
                value={props.repeats ?? ''}
              />
              x
            </React.Fragment>
          ) : (
            hasRepeats && `${props.repeats}x`
          ))}
      </div>
    </div>
  );
};
