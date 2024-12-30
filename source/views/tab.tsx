import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router';
import { BarGroup, StrummingPatternComponent } from '../components';
import {
  addSymbol,
  editSymbol,
  queryParameters,
  removeSymbol,
  RouteNames,
  saveSymbol,
} from '../constants';
import { getTabLocalStorageKey, sPatternService, tabService } from '../logic';
import { Tab } from '../types';

export type TabProps = {
  removeTab: (tabId: string) => void;
  updateTab: (updatedTab: Tab) => void;
};

export const TabView: React.FC<TabProps> = (props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tab, setTab] = useState<Tab>();

  const [searchParams, setSearchParams] = useSearchParams();
  const { tabId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stringifiedTab = localStorage.getItem(getTabLocalStorageKey(tabId!));
    if (stringifiedTab) {
      try {
        const nextSelectedTab = JSON.parse(stringifiedTab);
        setTab(nextSelectedTab);
      } catch (error) {
        console.error('Error retrieving the selected tab', error);
      }
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
    return (
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <NavLink style={{ marginRight: 8 }} to={RouteNames.home}>
          ⬅️
        </NavLink>
        <h3>Couldn't load tab</h3>
      </div>
    );
  }

  const addSection = () => {
    setTab(tabService.addSection(tab));
  };

  const addStrummingPattern = () => {
    setTab(tabService.addStrummingPattern(tab));
  };

  const toggleEditMode = () => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (isEditMode) {
      props.updateTab(tab);
      nextSearchParams.delete(queryParameters.editMode);
    } else {
      nextSearchParams.set(queryParameters.editMode, 'true');
    }

    setIsEditMode(!isEditMode);
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="tab">
      <NavLink style={{ marginRight: 8 }} to={RouteNames.home}>
        ⬅️ Home page
      </NavLink>
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <h3>
          {isEditMode ? (
            <input
              value={tab.title}
              onChange={(event) => {
                setTab(tabService.updateTitle(tab, event.target.value));
              }}
            />
          ) : (
            tab.title
          )}
        </h3>
        <div style={{ marginLeft: 8 }}>
          <button onClick={toggleEditMode} type="button">
            {isEditMode ? saveSymbol : editSymbol}
          </button>
        </div>
        <div style={{ marginLeft: 8 }}>
          <button
            onClick={() => {
              props.removeTab(tab.id);
              navigate(RouteNames.home);
            }}
            type="button"
          >
            {removeSymbol}
          </button>
        </div>
      </div>

      <BarGroup
        addStrummingPattern={addStrummingPattern}
        bars={tab.bars}
        isEditMode={isEditMode}
        tab={tab}
        updateTab={setTab}
      />

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
                  setTab(sPatternService.rebase(tab, sPattern.index, framesNumber));
                }}
                strummingPattern={sPattern}
                update={(frameIndex, value) => {
                  setTab(sPatternService.update(tab, sPattern.index, frameIndex, value));
                }}
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
              <React.Fragment key={section.index}>
                {section.name}

                <BarGroup
                  addStrummingPattern={addStrummingPattern}
                  bars={section.bars}
                  isEditMode={isEditMode}
                  inSection={section}
                  tab={tab}
                  updateTab={setTab}
                />
              </React.Fragment>
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
};
