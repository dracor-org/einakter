import {Link} from 'react-router-dom';
import {Play} from '../types';
import IdLink from './IdLink';

export default function TitleCell({
  play,
  urlPath = '',
}: {
  play: Play;
  urlPath?: string;
}) {
  const {title, subtitle, slug, ids: {dracor, wikidata, weber} = {}} = play;
  return (
    <span>
      <Link className="text-lg" to={`${urlPath}${slug}`}>
        {title}
      </Link>
      {subtitle && (
        <small>
          <br />
          {subtitle}
        </small>
      )}
      <div>
        {wikidata && (
          <small>
            <IdLink id={wikidata} type="wikidata" />
          </small>
        )}{' '}
        {dracor && (
          <small>
            <IdLink id={dracor} type="dracor" />
          </small>
        )}{' '}
        {weber && (
          <small>
            <IdLink id={weber} type="weber" />
          </small>
        )}
      </div>
    </span>
  );
}
