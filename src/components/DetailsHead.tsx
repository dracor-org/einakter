import IdCopy from './IdCopy';
import Authors from './Authors';
import AuthorInfo from './AuthorInfo';
import {Author} from '../types';

interface Props {
  id: string;
  title: string;
  subtitle?: string;
  authors?: Author[];
}

const DetailsHead = ({id, authors = [], title, subtitle}: Props) => {
  return (
    <div className="flex justify-between mb-4 flex-col gap-3 md:flex-row">
      <div>
        <hgroup>
          <h2>
            <Authors authors={authors} />
          </h2>
          <h1>{title}</h1>
          {subtitle && <h3>{subtitle}</h3>}
          <IdCopy id={id} className="mt-1" />
        </hgroup>
      </div>
      <div>
        {authors
          .filter((a) => Boolean(a.wikidata))
          .map((a) => (
            <AuthorInfo
              key={a.wikidata}
              fullname={a.name || ''}
              wikidataId={a.wikidata || ''}
            />
          ))}
      </div>
    </div>
  );
};

export default DetailsHead;
