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
    (slot) => slotOperations.getSlotLength(slot) > 0,
  );
  const canUpdate = props.isEditMode && props.canUpdate;

  const getBackground = (slot: Slot) => {
    const backgroundColor = getBackgroundColor(slot);
    return `linear-gradient(180deg, ${backgroundColor} calc(50% - 1px), black calc(50%), ${backgroundColor} calc(50% + 1px)`;
  };

  const getBackgroundColor = (slot: Slot) => {
    return (
      getSlotBackgroundColor(props.tab.activeSlot, props.container.position, slot.index) ??
      props.backgroundColor
    );
  };

  const setSlotSize = (size: number, indexesPath: number[]) => {
    const nextTab = tabOperations.setPickingBarSlotsSize(
      props.tab,
      props.container.originalBar.index,
      size,
      indexesPath,
      props.container.inSection,
    );
    props.updateTab(nextTab);
  };

  const setSlotValue =
    (stringIndex: number | 'chordSupport') => (value: string, indexesPath: number[]) => {
      const nextTab = tabOperations.setPickingBarSlotValue(
        props.tab,
        props.container.originalBar.index,
        stringIndex,
        value,
        indexesPath,
        props.container.inSection,
      );

      props.updateTab(nextTab);
    };

  return (
    <div
      className="picking-bar"
      style={{
        borderLeft: '1px solid black',
        boxSizing: 'border-box',
      }}
    >
      {canUpdate && (
        <div style={{ marginBottom: 8 }}>
          <SlotDivider
            denominator={1}
            indexesPath={[]}
            isFirstSlot={true}
            parentSlotSize={virtualSlot.slots.length}
            setSlotSize={setSlotSize}
            slot={virtualSlot}
          />
        </div>
      )}

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

      {(displayChordSupport || canUpdate) && (
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
