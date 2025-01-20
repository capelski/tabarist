import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { TextFilter } from '../components';
import { getTabRelativeUrl } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';

export type HomeViewProps = {};

export const HomeView: React.FC<HomeViewProps> = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [titleFilter, setTitleFilter] = useState('');

  useEffect(() => {
    tabRepository.getPublicTabs(titleFilter).then(setTabs);
  }, [titleFilter]);

  return (
    <div className="tab-registry">
      <p>
        <TextFilter text={titleFilter} textSetter={setTitleFilter} />
      </p>
      {tabs.length === 0 && <p>No tabs to display</p>}
      {tabs
        .filter((tab) => {
          return tab.title.toLowerCase().includes(titleFilter.toLocaleLowerCase());
        })
        .map((tab) => {
          return (
            <div
              key={tab.id}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}
            >
              <div>
                {tab.title}
                <NavLink style={{ marginLeft: 8 }} to={getTabRelativeUrl(tab.id)}>
                  ➡️
                </NavLink>
              </div>
            </div>
          );
        })}
    </div>
  );
};
