import React from 'react';
import { ContainerType } from '../../constants';
import { tabOperations } from '../../operations';
import { BarContainer, Slot } from '../../types';
import { SlotsValue } from '../common/slots-value';
import { BarComponentBaseProps, getSlotBackgroundColor } from './bar-handlers';

export type ChordBarCoreProps = BarComponentBaseProps & {
  areRhythmSlotsEditable?: boolean;
  container: BarContainer<ContainerType.chord>;
};

export const ChordBarComponent: React.FC<ChordBarCoreProps> = (props) => {
  const rhythmSlots =
    props.container.renderedBar.rhythmIndex !== undefined
      ? props.tab.rhythms.find(
          (rhythm) => rhythm.index === props.container.renderedBar.rhythmIndex,
        )!.slots
      : props.container.renderedBar.rhythmSlots;

  const canEditRhythmSlots =
    !!props.areRhythmSlotsEditable && props.container.renderedBar.rhythmIndex === undefined;

  const getBackgroundColor = (slot: Slot) => {
    return getSlotBackgroundColor(props.activeSlot, props.container.position, slot.index);
  };

  const setSlotValue =
    (property: 'slots' | 'rhythmSlots') => (value: string, indexesPath: number[]) => {
      const nextTab = tabOperations.setChordBarSlotValue(
        props.tab,
        props.container.barIndex,
        value,
        indexesPath,
        property,
        props.container.parentSection,
      );

      props.updateTab(nextTab);
    };

  return (
    <div
      className="chord-bar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <SlotsValue
        backgroundColor={getBackgroundColor}
        canUpdate={props.container.canUpdate}
        elementType="input"
        indexesPath={[]}
        isEditMode={props.isEditMode}
        setSlotValue={setSlotValue('slots')}
        slots={props.container.renderedBar.slots}
      />

      <SlotsValue
        backgroundColor={getBackgroundColor}
        canUpdate={canEditRhythmSlots}
        color={props.container.omitRhythm ? '#bbb' : undefined}
        elementType={canEditRhythmSlots ? 'select' : 'input'}
        indexesPath={[]}
        isEditMode={canEditRhythmSlots}
        setSlotValue={setSlotValue('rhythmSlots')}
        slots={rhythmSlots}
      />
    </div>
  );
};
