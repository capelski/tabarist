import React from 'react';
import {
  inputWidth,
  rhythmLineColor,
  rhythmNestedLineColor,
  slotsOptions,
  SlotType,
} from '../../constants';
import { Slot } from '../../types';
import { SlotsDivider } from './slots-divider';

export type SlotDividerProps = {
  /** When set to undefined to the size fraction will be hidden */
  denominator: number | undefined;
  indexesPath: number[];
  isFirstSlot: boolean;
  parentSlotSize: number;
  setSlotSize: (size: number, indexesPath: number[]) => void;
  slot: Slot;
};

export const SlotDivider: React.FC<SlotDividerProps> = (props) => {
  const slotSize = props.slot.type === SlotType.block ? props.slot.slots.length : 1;
  const showText =
    props.indexesPath.length === 0 || (props.denominator && props.slot.type === SlotType.value);

  return (
    <div
      className="slot-divider"
      key={props.slot.index}
      style={{
        alignItems: 'center',
        borderLeft: props.isFirstSlot
          ? undefined
          : props.indexesPath.length > 1
          ? `1px solid ${rhythmNestedLineColor}`
          : `1px solid ${rhythmLineColor}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexBasis: `${100 / props.parentSlotSize}%`,
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {showText && (
          <span style={{ marginRight: 4 }}>
            {props.indexesPath.length === 0 ? 'Beats' : `1/${props.denominator}`}
          </span>
        )}

        <select
          onChange={(event) => {
            const nextSlotSize = parseInt(event.target.value);
            props.setSlotSize(nextSlotSize, props.indexesPath);
          }}
          style={{ width: inputWidth }}
          value={slotSize}
        >
          {slotsOptions.map((option) => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      </div>

      {props.slot.type === SlotType.block && (
        <React.Fragment>
          <div
            style={{
              boxSizing: 'border-box',
              marginBottom: 4,
              marginTop: 12,
              padding: '0 4px',
              width: '100%',
            }}
          >
            <div
              style={{
                backgroundColor:
                  props.indexesPath.length > 0 ? rhythmNestedLineColor : rhythmLineColor,
                height: 1,
              }}
            ></div>
          </div>

          <SlotsDivider
            denominator={props.denominator}
            indexesPath={props.indexesPath}
            setSlotSize={props.setSlotSize}
            slots={props.slot.slots}
          />
        </React.Fragment>
      )}
    </div>
  );
};
