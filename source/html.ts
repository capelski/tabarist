import { AppProps } from './app';

export declare const getHtml: (options?: {
  adSenseId?: string;
  appHtml?: string;
  headTags?: string;
  initialState?: AppProps;
}) => string;

export declare const routes: Array<string | RegExp>;
