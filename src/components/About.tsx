import React, {lazy, Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {Trans, t} from '@lingui/macro';
import {importMDX} from 'mdx.macro';

const Content = lazy(() => importMDX('../about.mdx'));

export default function About () {
  return (
    <div className="page">
      <Helmet>
        <title>Einakter: {t`About`}</title>
      </Helmet>
      <Suspense fallback={<div><Trans>Loading...</Trans></div>}>
        <Content/>
      </Suspense>
    </div>
  );
}
