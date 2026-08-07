import {Authors as DracorAuthors} from '@dracor/react';
import {Author} from '../types';

interface Props {
  authors: Author[];
  withLink?: boolean;
}

const Authors = ({authors, withLink}: Props) => {
  const data = authors.map((a) => ({
    name: a.name || '',
    pseudonym: a.pseudonym,
    ref: withLink && a.wikidata ? `wikidata:${a.wikidata}` : undefined,
  }));
  return <DracorAuthors data={data} />;
};

export default Authors;
