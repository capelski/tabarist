import React from 'react';
import { StaticRouter } from 'react-router';
import { App, AppProps } from './app';

export type SsrAppProps = AppProps & {
  location: string;
};

export { getHtml } from './html';

export const SsrApp: React.FC<SsrAppProps> = (props) => {
  const { location, ...otherProps } = props;
  return (
    <StaticRouter location={props.location}>
      <App {...otherProps} />
    </StaticRouter>
  );
};
