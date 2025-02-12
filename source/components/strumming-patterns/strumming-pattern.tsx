import React, { useState } from 'react';
import { frameMaxCharacters, removeSymbol, stringHeight } from '../../constants';
import { sPatternOperations, tabOperations } from '../../operations';
import { StrummingPattern, Tab } from '../../types';
import { DivisionsPicker } from '../common/divisions-picker';

export type StrummingPatternProps = {
  rebase: (framesNumber: number) => void;
  strummingPattern: StrummingPattern;
  tab: Tab;
  update: (frameIndex: number, value: string) => void;
  updateTab: (tab: Tab) => void;
};

const subdivisionsMap: { [divisions: number]: string[] } = {
  1: ['1', '2', '3', '4'],
  2: ['1', '&', '2', '&', '3', '&', '4', '&'],
  4: ['1', 'e', '&', 'e', '2', 'e', '&', 'e', '3', 'e', '&', 'e', '4', 'e', '&', 'e'],
};

export const StrummingPatternComponent: React.FC<StrummingPatternProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const divisions = props.strummingPattern.frames.length / 4;

  return (
    <div className="strumming-pattern" style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBlockStart: '1em', // Mimics <p>
          marginBlockEnd: '1em',
        }}
      >
        <div>
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
            style={{ marginRight: 8 }}
            type="button"
          >
            {isExpanded ? '⬇️' : '➡️'}
          </button>

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
        </div>

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
      </div>

      {isExpanded && (
        <React.Fragment>
          <div style={{ display: 'flex' }}>
            {props.strummingPattern.frames.map((frame, index) => {
              const isFirstFrame = index === 0;
              const isLastFrame = index === props.strummingPattern.frames.length - 1;

              return (
                <div
                  className="frame"
                  key={frame.index}
                  style={{
                    alignItems: 'center',
                    borderLeft: isFirstFrame ? undefined : '1px solid #ccc',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingLeft: isFirstFrame ? undefined : '4px',
                    paddingRight: isLastFrame ? undefined : '4px',
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
                  <span style={{ color: '#ccc' }}>{subdivisionsMap[divisions][frame.index]}</span>
                </div>
              );
            })}
          </div>
          <p>
            <DivisionsPicker
              framesNumber={props.strummingPattern.framesNumber}
              rebase={props.rebase}
            />
          </p>
        </React.Fragment>
      )}
    </div>
  );
};
