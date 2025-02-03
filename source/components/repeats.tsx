import React from 'react';
import { repeatsHeight, sectionColor } from '../constants';
import { tabOperations } from '../operations';
import { BarContainer, Tab } from '../types';
import { SectionPicker, SectionPickerProps } from './section-picker';

export type RepeatsProps = {
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
                  style={{ boxSizing: 'border-box', marginRight: 4, maxHeight: 20, maxWidth: 30 }}
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
              <span>
                {hasRepeats && `${repeats}x `}
                {props.container.inSectionBar?.referredSection.name}
              </span>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
