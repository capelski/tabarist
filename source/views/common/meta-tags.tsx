import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router';

export type MetaTagsProps = {
  description?: string;
  title: string;
};

export const MetaTags: React.FC<MetaTagsProps> = (props) => {
  const { pathname } = useLocation();

  return (
    <Helmet>
      <title>{props.title}</title>
      <meta property="og:title" content={props.title} />

      {props.description && <meta name="description" content={props.description} />}
      {props.description && <meta property="og:description" content={props.description} />}

      <meta property="og:site_name" content="Tabarist" />
      <meta property="og:url" content={`${PRODUCTION_URL_BASE}${pathname}`} />
    </Helmet>
  );
};
