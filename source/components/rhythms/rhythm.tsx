import React, { useState } from 'react';
import { removeSymbol } from '../../constants';
import { rhythmOperations, slotOperations, tabOperations } from '../../operations';
import { Rhythm, Tab } from '../../types';
import { SlotDivider } from '../common/slot-divider';
import { SlotsValue } from '../common/slots-value';

export type RhythmProps = {
  rhythm: Rhythm;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const RhythmComponent: React.FC<RhythmProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const virtualSlot = slotOperations.createBlockSlot(0, props.rhythm.slots);

  const setSlotSize = (size: number, indexesPath: number[]) => {
    const nextTab = rhythmOperations.setSlotSize(props.tab, props.rhythm.index, size, indexesPath);
    props.updateTab(nextTab);
  };

  const setSlotValue = (value: string, indexesPath: number[]) => {
    const nextTab = rhythmOperations.setSlotValue(
      props.tab,
      props.rhythm.index,
      value,
      indexesPath,
    );
    props.updateTab(nextTab);
  };

  return (
    <div className="rhythm" style={{ marginBottom: 16 }}>
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
              const nextTab = tabOperations.renameRhythm(
                props.tab,
                props.rhythm.index,
                event.target.value,
              );
              props.updateTab(nextTab);
            }}
            value={props.rhythm.name}
          />
        </div>

        <button
          disabled={!rhythmOperations.canDelete(props.tab, props.rhythm.index)}
          onClick={() => {
            const nextTab = tabOperations.removeRhythm(props.tab, props.rhythm.index);
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
          <SlotDivider
            denominator={1}
            indexesPath={[]}
            isFirstSlot={true}
            parentSlotSize={virtualSlot.slots.length}
            setSlotSize={setSlotSize}
            slot={virtualSlot}
          />

          <div style={{ marginTop: 8 }}>
            <SlotsValue
              canUpdate={true}
              elementType="select"
              indexesPath={[]}
              setSlotValue={setSlotValue}
              slots={props.rhythm.slots}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
