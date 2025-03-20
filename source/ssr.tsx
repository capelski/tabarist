import React from 'react';
import { StaticRouter } from 'react-router';
import { App, AppProps } from './app';

export { AppPropsBase } from './app';
export { getHtml } from './html';
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
