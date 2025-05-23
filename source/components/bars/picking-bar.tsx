import React from 'react';
import { ContainerType } from '../../constants';
import { slotOperations, tabOperations } from '../../operations';
import { BarContainer, Slot } from '../../types';
import { SlotsValue } from '../common/slots-value';
import { BarComponentBaseProps, getSlotBackgroundColor } from './bar-handlers';

export type PickingBarComponentProps = BarComponentBaseProps & {
  container: BarContainer<ContainerType.picking>;
};

export const PickingBarComponent: React.FC<PickingBarComponentProps> = (props) => {
  const displayChordSupport = props.container.renderedBar.chordSupport.some(
    (slot) => slotOperations.getSlotLength(slot, 0) > 0,
  );

  const getBackground = (slot: Slot) => {
    const backgroundColor = getBackgroundColor(slot);
    return `linear-gradient(180deg, ${backgroundColor} calc(50% - 1px), #555 calc(50%), ${backgroundColor} calc(50% + 1px))`;
  };

  const getBackgroundColor = (slot: Slot) => {
    return (
      getSlotBackgroundColor(props.activeSlot, props.container.position, slot.index) ??
      'transparent'
    );
  };

  const setSlotValue =
    (stringIndex: number | 'chordSupport') => (value: string, indexesPath: number[]) => {
      const nextTab = tabOperations.setPickingBarSlotValue(
        props.tab,
        props.container.barIndex,
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
        width: '100%',
      }}
    >
      {props.container.renderedBar.strings.map((string) => {
        return (
          <SlotsValue
            background={getBackground}
            backgroundColor={getBackgroundColor}
            canUpdate={props.container.canUpdate}
            elementType="input"
            indexesPath={[]}
            isEditMode={props.isEditMode}
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
            canUpdate={props.container.canUpdate}
            elementType="input"
            indexesPath={[]}
            isEditMode={props.isEditMode}
            setSlotValue={setSlotValue('chordSupport')}
            slots={props.container.renderedBar.chordSupport}
          />
        </div>
      )}
    </div>
  );
};
