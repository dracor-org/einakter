import React from 'react';
import {Helmet} from 'react-helmet-async';
import {t} from '@lingui/macro';
import Content from '../about.mdx';

export default function About () {
  return (
    <div className="page p-4 markdown max-w-screen-lg">
      <Helmet>
        <title>Einakter: {t`About`}</title>
      </Helmet>
      <Content/>
    </div>
  );
}
