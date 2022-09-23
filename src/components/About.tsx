import React, {lazy, Suspense} from 'react';
import {Helmet} from 'react-helmet-async';
import {Trans, t} from '@lingui/macro';
import {importMDX} from 'mdx.macro';

const Content = lazy(() => importMDX('../about.mdx'));

export default function About () {
  return (
    <div className="page p-4 markdown max-w-screen-lg">
      <Helmet>
        <title>Einakter: {t`About`}</title>
      </Helmet>
      <Suspense fallback={<div><Trans>Loading...</Trans></div>}>
        <Content/>
      </Suspense>
    </div>
  );
}
