import React from 'react';
import { framesNumberOptions, stringHeight } from '../constants';
import { tabService } from '../logic';
import { StrummingPattern, Tab } from '../types';

export type StrummingPatternProps = {
  rebase: (framesNumber: number) => void;
  strummingPattern: StrummingPattern;
  tab: Tab;
  update: (frameIndex: number, value: string) => void;
  updateTab: (tab: Tab) => void;
};

export const StrummingPatternComponent: React.FC<StrummingPatternProps> = (props) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <p>
        <input
          onChange={(event) => {
            const nextTab = tabService.renameStrummingPattern(
              props.tab,
              props.strummingPattern.index,
              event.target.value,
            );
            props.updateTab(nextTab);
          }}
          value={props.strummingPattern.name}
        />
      </p>
      <div style={{ display: 'flex' }}>
        {props.strummingPattern.frames.map((frame) => {
          return (
            <div
              className="frame"
              key={frame.index}
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                className="chord"
                style={{
                  textAlign: 'center',
                }}
              >
                <input
                  maxLength={3}
                  onChange={(event) => {
                    props.update(frame.index, event.target.value);
                  }}
                  style={{
                    boxSizing: 'border-box',
                    height: stringHeight,
                    maxWidth: 30,
                    padding: 0,
                    textAlign: 'center',
                  }}
                  value={frame.value || ''}
                />
              </div>
            </div>
          );
        })}
      </div>

      <select
        onChange={(event) => {
          props.rebase(parseInt(event.target.value));
        }}
        value={props.strummingPattern.framesNumber}
      >
        {framesNumberOptions.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};
