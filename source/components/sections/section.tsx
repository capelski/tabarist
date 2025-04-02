import React, { useState } from 'react';
import { BarGroup } from '..';
import { removeSymbol } from '../../constants';
import { barsToBarContainers, sectionOperations, tabOperations } from '../../operations';
import { Section, Tab } from '../../types';

export type SectionProps = {
  isEditMode: boolean;
  section: Section;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const SectionComponent: React.FC<SectionProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="section">
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
              const nextTab = tabOperations.renameSection(
                props.tab,
                props.section.index,
                event.target.value,
              );
              props.updateTab(nextTab);
            }}
            value={props.section.name}
          />
        </div>

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
      </div>

      {isExpanded && (
        <BarGroup
          {...props}
          activeSlot={undefined}
          barContainers={barsToBarContainers(props.tab, props.section.bars, {
            inSection: props.section,
          })}
          barsNumber={props.section.bars.length}
          inSection={props.section}
          scrollView={undefined}
        />
      )}
    </div>
  );
};
