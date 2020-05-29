import React, {lazy, Suspense} from 'react';
import {importMDX} from 'mdx.macro';

const Content = lazy(() => importMDX('../about.mdx'));

export default function About () {
  return (
    <div className="page">
      <Suspense fallback={<div>Loading...</div>}>
        <Content/>
      </Suspense>
    </div>
  );
}
