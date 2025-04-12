import React from 'react';
import { StaticRouter } from 'react-router';
import { App, AppProps } from './app';

export { AppProps } from './app';
export * from './constants';
export * from './html';
export * from './operations';
export * from './types';

export type SsrAppProps = AppProps & {
  location: string;
};

export const SsrApp: React.FC<SsrAppProps> = (props) => {
  const { location, ...otherProps } = props;
  return (
    <StaticRouter location={props.location}>
      <App {...otherProps} />
    </StaticRouter>
  );
};
