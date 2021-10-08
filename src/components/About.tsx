import React, {lazy, Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {importMDX} from 'mdx.macro';

const Content = lazy(() => importMDX('../about.mdx'));

export default function About () {
  return (
    <div className="page">
      <Helmet>
        <title>Einakter: About</title>
      </Helmet>
      <Suspense fallback={<div>Loading...</div>}>
        <Content/>
      </Suspense>
    </div>
  );
}
