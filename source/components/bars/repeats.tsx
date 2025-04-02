import React from 'react';
import { inputWidth, repeatsHeight, sectionColor, sectionNameMaxWidth } from '../../constants';
import { tabOperations } from '../../operations';
import { ActiveSlot, BarContainer, Tab } from '../../types';
import { SectionPicker, SectionPickerProps } from './section-picker';

export type RepeatsProps = {
  activeSlot: ActiveSlot | undefined;
  canChangeSection: boolean;
  canRepeat: boolean;
  container: BarContainer;
  isEditMode: boolean;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const Repeats: React.FC<RepeatsProps> = (props) => {
  const { repeats } = props.container.originalBar;
  const hasRepeats = repeats && repeats > 1;
  const remainingRepeats =
    props.activeSlot?.barContainer.positionOfFirstBar === props.container.positionOfFirstBar &&
    props.activeSlot?.repeats;

  const changeSection: SectionPickerProps['changeSection'] = (sectionIndex) => {
    const nextTab = tabOperations.changeSection(
      props.tab,
      props.container.originalBar.index,
      sectionIndex,
    );
    props.updateTab(nextTab);
  };

  const updateRepeats = (nextRepeats?: number) => {
    const nextTab = tabOperations.updateRepeats(
      props.tab,
      props.container.originalBar.index,
      nextRepeats,
      props.container.inSection,
    );
    props.updateTab(nextTab);
  };

  return (
    <div className="repeats" style={{ height: repeatsHeight }}>
      <div
        style={{
          backgroundColor: props.container.inSectionBar ? sectionColor : undefined,
          height: 20,
          marginRight: props.container.isLastInSectionBar ? 8 : undefined,
          paddingLeft: 8,
        }}
      >
        {props.canRepeat && (
          <React.Fragment>
            {props.isEditMode ? (
              <React.Fragment>
                <input
                  onChange={(event) => {
                    const nextRepeats = parseInt(event.target.value);
                    updateRepeats(isNaN(nextRepeats) ? undefined : nextRepeats);
                  }}
                  style={{
                    boxSizing: 'border-box',
                    marginRight: 4,
                    maxHeight: 20,
                    maxWidth: inputWidth,
                  }}
                  value={repeats ?? ''}
                />
                x
                {props.canChangeSection && (
                  <SectionPicker
                    changeSection={changeSection}
                    section={props.container.inSectionBar!.referredSection}
                    sections={props.tab.sections}
                  />
                )}
              </React.Fragment>
            ) : (
              <span
                style={{
                  display: 'inline-block',
                  maxWidth: sectionNameMaxWidth,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {remainingRepeats ? (
                  <span style={{ fontWeight: 'bold' }}>{remainingRepeats}x </span>
                ) : (
                  hasRepeats && <span>{repeats}x </span>
                )}
                {props.container.inSectionBar?.referredSection.name}
              </span>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
