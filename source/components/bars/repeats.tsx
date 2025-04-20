import React from 'react';
import { inputWidth, repeatsHeight, sectionColor, sectionNameMaxWidth } from '../../constants';
import { tabOperations } from '../../operations';
import { ActiveSlot, BarContainer, Tab } from '../../types';

export type RepeatsProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  isEditMode: boolean;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const Repeats: React.FC<RepeatsProps> = (props) => {
  const { repeats } = props.container;
  const hasRepeats = repeats && repeats > 1;
  const remainingRepeats =
    props.activeSlot?.barContainer.firstSectionBarPosition ===
      props.container.firstSectionBarPosition && props.activeSlot?.repeats;

  const updateRepeats = (nextRepeats?: number) => {
    const nextTab = tabOperations.updateRepeats(
      props.tab,
      props.container.barIndex,
      nextRepeats,
      props.container.parentSection,
    );
    props.updateTab(nextTab);
  };

  return (
    <div className="repeats" style={{ height: repeatsHeight }}>
      <div
        style={{
          backgroundColor: props.container.parentSection ? sectionColor : undefined,
          height: 20,
          marginRight: props.container.isLastInSectionBar ? 8 : undefined,
          paddingLeft: 8,
        }}
      >
        {props.isEditMode && !props.container.parentSection && (
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
          </React.Fragment>
        )}

        {!props.isEditMode &&
          (!props.container.parentSection || props.container.isFirstInSectionBar) && (
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
              {props.container.parentSection?.name}
            </span>
          )}
      </div>
    </div>
  );
};
