import {IdCopy, AuthorInfo} from '@dracor/react';
import {t} from '@lingui/core/macro';
import Authors from './Authors';
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
          <IdCopy
            icon="ein"
            prefix="https://einakter.dracor.org/id/"
            className="mt-1"
          >
            {id}
          </IdCopy>
        </hgroup>
      </div>
      <div>
        {authors
          .filter((a) => Boolean(a.wikidata))
          .map((a) => (
            <AuthorInfo
              key={a.wikidata}
              name={a.name || ''}
              wikidataId={a.wikidata || ''}
              birthLabel={t`b.`}
              deathLabel={t`d.`}
              unknownLabel={t`unknown`}
            />
          ))}
      </div>
    </div>
  );
};

export default DetailsHead;
