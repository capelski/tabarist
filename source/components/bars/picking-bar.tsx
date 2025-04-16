import React from 'react';
import { slotOperations, tabOperations } from '../../operations';
import { BarContainer, PickingBar, Slot } from '../../types';
import { SlotDivider } from '../common/slot-divider';
import { SlotsValue } from '../common/slots-value';
import { BarComponentBaseProps, getSlotBackgroundColor } from './bar-handlers';

export type PickingBarComponentProps = BarComponentBaseProps & {
  container: BarContainer<PickingBar>;
};

export const PickingBarComponent: React.FC<PickingBarComponentProps> = (props) => {
  const virtualSlot = slotOperations.createBlockSlot(0, props.container.renderedBar.chordSupport);
  const displayChordSupport = props.container.renderedBar.chordSupport.some(
    (slot) => slotOperations.getSlotLength(slot, 0) > 0,
  );
  const canUpdate = props.isEditMode && props.canUpdate;

  const getBackground = (slot: Slot) => {
    const backgroundColor = getBackgroundColor(slot);
    return `linear-gradient(180deg, ${backgroundColor} calc(50% - 1px), #555 calc(50%), ${backgroundColor} calc(50% + 1px))`;
  };

  const getBackgroundColor = (slot: Slot) => {
    return (
      getSlotBackgroundColor(props.activeSlot, props.container.position, slot.index) ??
      props.backgroundColor
    );
  };

  const setSlotSize = (size: number, indexesPath: number[]) => {
    const nextTab = tabOperations.setPickingBarSlotsSize(
      props.tab,
      props.container.originalIndex,
      size,
      indexesPath,
      props.container.parentSection,
    );
    props.updateTab(nextTab);
  };

  const setSlotValue =
    (stringIndex: number | 'chordSupport') => (value: string, indexesPath: number[]) => {
      const nextTab = tabOperations.setPickingBarSlotValue(
        props.tab,
        props.container.originalIndex,
        stringIndex,
        value,
        indexesPath,
        props.container.parentSection,
      );

      props.updateTab(nextTab);
    };

  return (
    <div
      className="picking-bar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      {props.isEditMode &&
        (props.canUpdate ? (
          <div style={{ marginBottom: 8 }}>
            <SlotDivider
              denominator={undefined}
              indexesPath={[]}
              isFirstSlot={true}
              parentSlotSize={virtualSlot.slots.length}
              setSlotSize={setSlotSize}
              slot={virtualSlot}
            />
          </div>
        ) : (
          <div style={{ flexGrow: 1 }}></div>
        ))}

      {props.container.renderedBar.strings.map((string) => {
        return (
          <SlotsValue
            background={getBackground}
            backgroundColor={getBackgroundColor}
            canUpdate={canUpdate}
            elementType="input"
            indexesPath={[]}
            key={string.index}
            setSlotValue={setSlotValue(string.index)}
            slots={string.slots}
          />
        );
      })}

      {(displayChordSupport || props.isEditMode) && (
        <div style={{ marginTop: 8 }}>
          <SlotsValue
            backgroundColor={getBackgroundColor}
            canUpdate={canUpdate}
            elementType="input"
            indexesPath={[]}
            setSlotValue={setSlotValue('chordSupport')}
            slots={props.container.renderedBar.chordSupport}
          />
        </div>
      )}
    </div>
  );
};
