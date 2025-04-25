import React from 'react';
import {
  rhythmLineColor,
  rhythmNestedLineColor,
  SlotType,
  slotValueOptions,
  stringHeight,
} from '../../constants';
import { Slot } from '../../types';

export type SlotsValueProps = {
  background?: (slot: Slot) => string | undefined;
  backgroundColor?: (slot: Slot) => string | undefined;
  canUpdate: boolean;
  color?: string;
  elementType: 'input' | 'select';
  indexesPath: number[];
  isEditMode: boolean;
  setSlotValue: (value: string, indexesPath: number[]) => void;
  slots: Slot[];
};

export const SlotsValue: React.FC<SlotsValueProps> = (props) => {
  return (
    <div className="slots-value" style={{ display: 'flex', width: '100%' }}>
      {props.slots.map((slot) => {
        const isFirstSlot = slot.index === 0;
        const currenPath = [...props.indexesPath, slot.index];
        const background = props.background?.(slot);
        const backgroundColor =
          props.isEditMode && !props.canUpdate ? '#f4f4f4' : props.backgroundColor?.(slot);

        return (
          <div
            className="slot-value"
            key={slot.index}
            style={{
              background,
              backgroundColor,
              alignItems: 'center',
              borderLeft: isFirstSlot
                ? undefined
                : props.indexesPath.length > 0
                ? `1px solid ${rhythmNestedLineColor}`
                : `1px solid ${rhythmLineColor}`,
              boxSizing: 'border-box',
              display: 'flex',
              flexBasis: `${100 / props.slots.length}%`,
              flexDirection: 'column',
            }}
          >
            {slot.type === SlotType.value ? (
              props.isEditMode && props.canUpdate ? (
                props.elementType === 'input' ? (
                  <input
                    onChange={(event) => {
                      props.setSlotValue(event.target.value, currenPath);
                    }}
                    style={{
                      backgroundColor,
                      border: 'none',
                      boxSizing: 'border-box',
                      height: stringHeight,
                      padding: 0,
                      textAlign: 'center',
                      width: '100%',
                    }}
                    value={slot.value}
                  />
                ) : (
                  <select
                    onChange={(event) => {
                      props.setSlotValue(event.target.value, currenPath);
                    }}
                    style={{
                      boxSizing: 'border-box',
                      height: stringHeight,
                      padding: 0,
                      textAlign: 'center',
                      width: '100%',
                    }}
                    value={slot.value}
                  >
                    {slotValueOptions.map((option) => {
                      return (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      );
                    })}
                  </select>
                )
              ) : (
                <span
                  style={{
                    backgroundColor,
                    color: props.color,
                    height: stringHeight,
                    lineHeight: `${stringHeight}px`,
                  }}
                >
                  {slot.value}
                </span>
              )
            ) : (
              <SlotsValue
                background={() => background}
                backgroundColor={() => backgroundColor}
                canUpdate={props.canUpdate}
                color={props.color}
                elementType={props.elementType}
                indexesPath={currenPath}
                isEditMode={props.isEditMode}
                setSlotValue={props.setSlotValue}
                slots={slot.slots}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
