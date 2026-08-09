import {t} from '@lingui/core/macro';
import Content from '../about.mdx';

export default function About() {
  return (
    <div className="page p-4 prose max-w-5xl">
      <title>{`Einakter: ${t`About`}`}</title>
      <Content />
    </div>
  );
}
