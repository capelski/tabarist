import React from 'react';
import { Slot } from '../../types';
import { SlotDivider } from './slot-divider';

export type SlotsDividerProps = {
  denominator: number | undefined;
  indexesPath: number[];
  setSlotSize: (size: number, indexesPath: number[]) => void;
  slots: Slot[];
};

export const SlotsDivider: React.FC<SlotsDividerProps> = (props) => {
  return (
    <div className="slots-divider" style={{ display: 'flex', width: '100%' }}>
      {props.slots.map((slot) => {
        return (
          <SlotDivider
            denominator={props.denominator && props.slots.length * props.denominator}
            indexesPath={[...props.indexesPath, slot.index]}
            isFirstSlot={slot.index === 0}
            key={slot.index}
            parentSlotSize={props.slots.length}
            setSlotSize={props.setSlotSize}
            slot={slot}
          />
        );
      })}
    </div>
  );
};
