import React from 'react';
import { BarGroup } from '.';
import { removeSymbol } from '../constants';
import {
  barsToBarContainers,
  getIndexDisplayValue,
  sectionOperations,
  tabOperations,
} from '../operations';
import { Section, Tab } from '../types';

export type SectionProps = {
  barWidth: string;
  isEditMode: boolean;
  section: Section;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const SectionComponent: React.FC<SectionProps> = (props) => {
  return (
    <React.Fragment>
      <p>
        <span style={{ marginRight: 8 }}>{getIndexDisplayValue(props.section.index)}</span>
        <input
          onChange={(event) => {
            const nextTab = tabOperations.renameSection(
              props.tab,
              props.section.index,
              event.target.value,
            );
            props.updateTab(nextTab);
          }}
          value={props.section.name}
        />
        <button
          disabled={!sectionOperations.canDelete(props.tab, props.section.index)}
          onClick={() => {
            const nextTab = tabOperations.removeSection(props.tab, props.section.index);
            props.updateTab(nextTab);
          }}
          style={{ marginLeft: 8 }}
          type="button"
        >
          {removeSymbol}
        </button>
      </p>

      <BarGroup
        {...props}
        barContainers={barsToBarContainers(props.tab, props.section.bars, {
          inSection: props.section,
        })}
        barsNumber={props.section.bars.length}
        inSection={props.section}
      />
    </React.Fragment>
  );
};
