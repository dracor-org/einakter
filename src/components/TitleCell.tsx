import {Link} from '@tanstack/react-router';
import {Play} from '../types';
import IdLink from './IdLink';

interface Props {
  play: Play;
  to?: '/$slug' | '/originals/$slug';
}

export default function TitleCell({play, to = '/originals/$slug'}: Props) {
  const {title, subtitle, slug, ids: {dracor, wikidata, weber} = {}} = play;
  return (
    <span>
      <Link className="text-lg" to={to} params={{slug}}>
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
