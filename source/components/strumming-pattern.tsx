import React from 'react';
import { frameMaxCharacters, removeSymbol, stringHeight } from '../constants';
import { sPatternOperations, tabOperations } from '../operations';
import { StrummingPattern, Tab } from '../types';
import { TempoPicker } from './tempo-picker';

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
            const nextTab = tabOperations.renameStrummingPattern(
              props.tab,
              props.strummingPattern.index,
              event.target.value,
            );
            props.updateTab(nextTab);
          }}
          value={props.strummingPattern.name}
        />
        <button
          disabled={!sPatternOperations.canDelete(props.tab, props.strummingPattern.index)}
          onClick={() => {
            const nextTab = tabOperations.removeSPattern(props.tab, props.strummingPattern.index);
            props.updateTab(nextTab);
          }}
          style={{ marginLeft: 8 }}
          type="button"
        >
          {removeSymbol}
        </button>
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
                  maxLength={frameMaxCharacters}
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
      <p>
        <TempoPicker framesNumber={props.strummingPattern.framesNumber} rebase={props.rebase} />
      </p>
    </div>
  );
};
