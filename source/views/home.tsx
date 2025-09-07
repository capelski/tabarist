import React from 'react';
import { CenteredMessage } from '../components';
import { MetaTags } from './common/meta-tags';

export const HomeView: React.FC = () => {
  return (
    <React.Fragment>
      <MetaTags title="Tabarist" />

      <CenteredMessage>
        <h1>Welcome to Tabarist</h1>
      </CenteredMessage>
    </React.Fragment>
  );
};
