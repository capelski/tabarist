import React from 'react';
import { repeatsHeight, sectionColor } from '../constants';
import { BarContainer } from '../types';

export type RepeatsProps = {
  canRepeat: boolean;
  inSectionBar: BarContainer['inSectionBar'];
  isEditMode: boolean;
  isLastBarInSectionBar: boolean;
  repeats: number | undefined;
  updateRepeats: (repeats?: number) => void;
};

export const Repeats: React.FC<RepeatsProps> = (props) => {
  const hasRepeats = props.repeats && props.repeats > 1;

  return (
    <div style={{ height: repeatsHeight }}>
      <div
        style={{
          backgroundColor: props.inSectionBar ? sectionColor : undefined,
          height: 20,
          marginRight: props.isLastBarInSectionBar ? 8 : undefined,
          paddingLeft: 8,
        }}
      >
        {props.canRepeat && (
          <React.Fragment>
            {props.isEditMode ? (
              <React.Fragment>
                <input
                  onChange={(event) => {
                    const nextRepeats = parseInt(event.target.value);
                    props.updateRepeats(isNaN(nextRepeats) ? undefined : nextRepeats);
                  }}
                  style={{ boxSizing: 'border-box', marginRight: 4, maxHeight: 20, maxWidth: 30 }}
                  value={props.repeats ?? ''}
                />
                x
              </React.Fragment>
            ) : (
              <span>{hasRepeats && `${props.repeats}x`}</span>
            )}
            <span style={{ marginLeft: 8 }}>{props.inSectionBar?.referredSection.name}</span>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
