import React from 'react';
import { removeSymbol } from '../../constants';
import { rhythmOperations, slotOperations, tabOperations } from '../../operations';
import { Rhythm, Tab } from '../../types';
import { SlotDivider } from '../common/slot-divider';
import { SlotsValue } from '../common/slots-value';

export type RhythmProps = {
  isSelected: boolean;
  rhythm: Rhythm;
  setRhythm: () => void;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const RhythmComponent: React.FC<RhythmProps> = (props) => {
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
          <input
            defaultChecked={props.isSelected}
            name="rhythm"
            onChange={props.setRhythm}
            style={{ marginRight: 8 }}
            type="radio"
          />
          <input
            onChange={(event) => {
              const nextTab = tabOperations.renameRhythm(
                props.tab,
                props.rhythm.index,
                event.target.value,
              );
              props.updateTab(nextTab);
            }}
            readOnly={!props.isSelected}
            style={{ border: props.isSelected ? undefined : 'none', marginRight: 8 }}
            value={props.rhythm.name}
          />
        </div>

        <button
          className="btn btn-outline-danger"
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

      {props.isSelected && (
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
              isEditMode={true}
              setSlotValue={setSlotValue}
              slots={props.rhythm.slots}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
