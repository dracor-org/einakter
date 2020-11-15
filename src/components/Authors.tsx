import React from 'react';
import {Author} from '../types';

interface Props {
  authors: Author[]
};

const Authors = ({authors}: Props) => {
  return (
    <>
      {authors.map((author, i) => (
        <span key={`author-${i}-${author.name}`}>
          {i > 0 && ' · '}
          {author.name}
          {author.pseudonym && (<i> ({author.pseudonym})</i>)}
          {author.wikidata && (
            <small>
              {' '}
              <a href={`https://www.wikidata.org/wiki/${author.wikidata}`}>
                {author.wikidata}
              </a>
            </small>
          )}
          {' '}
        </span>
      ))}
    </>
  );
};

export default Authors;
