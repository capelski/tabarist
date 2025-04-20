import React from 'react';
import { addSymbol, BarType, NonReferenceBarType } from '../../constants';
import { SectionBar, Tab } from '../../types';
import { addBar } from './bar-handlers';

export type AddBarProps = {
  barIndex: number;
  disabled?: boolean;
  parentSection: SectionBar | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const AddBar: React.FC<AddBarProps> = (props) => {
  const addBarHandler = (barType: NonReferenceBarType) => {
    addBar(props.tab, props.updateTab, props.barIndex, barType, props.parentSection);
  };

  return (
    <React.Fragment>
      <button
        aria-expanded="false"
        className="btn btn-sm btn-outline-primary"
        disabled={props.disabled}
        data-bs-toggle="dropdown"
        type="button"
      >
        {addSymbol}
      </button>
      <ul className="dropdown-menu">
        <li>
          <a
            className="dropdown-item"
            onClick={() => {
              addBarHandler(BarType.chord);
            }}
          >
            🎵 Add chord bar
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => {
              addBarHandler(BarType.picking);
            }}
          >
            🎼 Add picking bar
          </a>
        </li>
        {!props.parentSection && (
          <li>
            <a
              className="dropdown-item"
              onClick={() => {
                addBarHandler(BarType.section);
              }}
            >
              📄 Add section
            </a>
          </li>
        )}
      </ul>
    </React.Fragment>
  );
};
