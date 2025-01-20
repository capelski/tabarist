import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { BarGroup, SectionComponent, StrummingPatternComponent } from '../components';
import {
  addSymbol,
  editSymbol,
  queryParameters,
  removeSymbol,
  RouteNames,
  saveSymbol,
} from '../constants';
import { User } from '../firebase';
import { sPatternOperations, tabOperations } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';

export type TabViewProps = {
  user: User | null;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tab, setTab] = useState<Tab>();

  const [searchParams, setSearchParams] = useSearchParams();
  const { tabId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (tabId) {
      tabRepository.getById(tabId).then(setTab);
    }
  }, [tabId]);

  useEffect(() => {
    if (searchParams.get(queryParameters.editMode) === 'true') {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [searchParams]);

  if (!tab) {
    return <h3>Couldn't load tab</h3>;
  }

  const isTabOwner = props.user && props.user.uid === tab.ownerId;

  const addSection = () => {
    setTab(tabOperations.addSection(tab));
  };

  const addStrummingPattern = () => {
    setTab(tabOperations.addStrummingPattern(tab));
  };

  const removeTab = async () => {
    if (!isTabOwner) {
      return;
    }

    await tabRepository.remove(tab.id);
    navigate(RouteNames.myTabs);
  };

  const toggleEditMode = async () => {
    if (!isTabOwner) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);

    if (isEditMode) {
      await tabRepository.set(tab, props.user!.uid);

      nextSearchParams.delete(queryParameters.editMode);
    } else {
      nextSearchParams.set(queryParameters.editMode, 'true');
    }

    setIsEditMode(!isEditMode);
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="tab">
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <h3>
          {isEditMode ? (
            <input
              value={tab.title}
              onChange={(event) => {
                setTab(tabOperations.updateTitle(tab, event.target.value));
              }}
            />
          ) : (
            tab.title
          )}
        </h3>
        {isTabOwner && (
          <React.Fragment>
            <button onClick={toggleEditMode} style={{ marginLeft: 8 }} type="button">
              {isEditMode ? saveSymbol : editSymbol}
            </button>
            <button onClick={removeTab} style={{ marginLeft: 8 }} type="button">
              {removeSymbol}
            </button>
          </React.Fragment>
        )}
      </div>

      <BarGroup bars={tab.bars} isEditMode={isEditMode} tab={tab} updateTab={setTab} />

      {isEditMode && (
        <React.Fragment>
          <h3>Strumming patterns</h3>
          <p>
            <button onClick={addStrummingPattern} type="button">
              {addSymbol} strumming pattern
            </button>
          </p>

          {tab.strummingPatterns.map((sPattern) => {
            return (
              <StrummingPatternComponent
                key={sPattern.index}
                rebase={(framesNumber) => {
                  setTab(sPatternOperations.rebase(tab, sPattern.index, framesNumber));
                }}
                strummingPattern={sPattern}
                tab={tab}
                update={(frameIndex, value) => {
                  setTab(sPatternOperations.update(tab, sPattern.index, frameIndex, value));
                }}
                updateTab={setTab}
              />
            );
          })}

          <h3>Sections</h3>
          <p>
            <button onClick={addSection} type="button">
              {addSymbol} section
            </button>
          </p>

          {tab.sections.map((section) => {
            return (
              <SectionComponent
                isEditMode={isEditMode}
                key={section.index}
                section={section}
                tab={tab}
                updateTab={setTab}
              />
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
};
