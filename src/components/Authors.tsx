import React from 'react';
import IdLink from './IdLink';
import {Author} from '../types';

interface Props {
  authors: Author[]
  withLink?: boolean
};

const Authors = ({authors, withLink}: Props) => {
  return (
    <>
      {authors.map((author, i) => (
        <span key={`author-${i}-${author.name}`}>
          {i > 0 &&  <br/> }
          {author.name}
          {author.pseudonym && (<i> ({author.pseudonym})</i>)}
          {(withLink && author.wikidata) && (
            <>
              {' '}
              <small>
                <IdLink id={author.wikidata} type="wikidata"/>
              </small>
            </>
          )}
        </span>
      ))}
    </>
  );
};

export default Authors;
