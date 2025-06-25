import React from 'react';
import { AddMode, addSymbol, BarType, NonReferenceBarType } from '../../constants';
import { SectionBar, Tab } from '../../types';
import { addBar } from './bar-handlers';

export type AddBarProps = {
  addMode: AddMode;
  barIndex: number;
  disabled?: boolean;
  parentSection: SectionBar | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const AddBar: React.FC<AddBarProps> = (props) => {
  const addBarHandler = (barType: NonReferenceBarType, barIndex: number) => {
    addBar(props.tab, props.updateTab, barIndex, barType, props.parentSection);
  };

  return (
    props.addMode !== AddMode.none && (
      <React.Fragment>
        <button
          aria-expanded="false"
          className="btn btn-sm btn-outline-primary"
          disabled={props.disabled}
          data-bs-toggle="dropdown"
          style={{ paddingBottom: 0, paddingTop: 0 }}
          type="button"
        >
          {addSymbol}
        </button>
        <ul className="dropdown-menu">
          {props.addMode === AddMode.single || props.addMode === AddMode.singleWithSection ? (
            <React.Fragment>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    addBarHandler(BarType.chord, props.barIndex);
                  }}
                >
                  🎵 Chord bar
                </a>
              </li>

              <li>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    addBarHandler(BarType.picking, props.barIndex);
                  }}
                >
                  🎼 Picking bar
                </a>
              </li>

              {props.addMode === AddMode.singleWithSection && (
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      addBarHandler(BarType.section, props.barIndex);
                    }}
                  >
                    📄 Section bar
                  </a>
                </li>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    addBarHandler(BarType.chord, props.barIndex - 1);
                  }}
                >
                  ⬅️ 🎵 Chord bar (left)
                </a>
              </li>

              <li>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    addBarHandler(BarType.picking, props.barIndex - 1);
                  }}
                >
                  ⬅️ 🎼 Picking bar (left)
                </a>
              </li>

              {props.addMode === AddMode.dualWithSection && (
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      addBarHandler(BarType.section, props.barIndex - 1);
                    }}
                  >
                    ⬅️ 📄 Section bar (left)
                  </a>
                </li>
              )}

              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    addBarHandler(BarType.chord, props.barIndex);
                  }}
                >
                  🎵 ➡️ Chord bar (right)
                </a>
              </li>

              <li>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    addBarHandler(BarType.picking, props.barIndex);
                  }}
                >
                  🎼 ➡️ Picking bar (right)
                </a>
              </li>

              {props.addMode === AddMode.dualWithSection && (
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      addBarHandler(BarType.section, props.barIndex);
                    }}
                  >
                    📄 ➡️ Section bar (right)
                  </a>
                </li>
              )}
            </React.Fragment>
          )}
        </ul>
      </React.Fragment>
    )
  );
};
