import { AppProps } from './app';

export declare const assetsFolder: string;

export declare const assetsPath: string;

export declare const getHtml: (options?: {
  adSenseId?: string;
  appHtml?: string;
  headTags?: string;
  initialState?: AppProps;
}) => string;
