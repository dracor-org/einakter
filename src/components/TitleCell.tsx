import {Link} from '@tanstack/react-router';
import {IdLink} from '@dracor/react';
import {Play} from '../types';

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
            <IdLink>{`wikidata:${wikidata}`}</IdLink>
          </small>
        )}{' '}
        {dracor && (
          <small>
            <IdLink>{`dracor:${dracor}`}</IdLink>
          </small>
        )}{' '}
        {weber && (
          <small>
            <IdLink>{`wega:${weber}`}</IdLink>
          </small>
        )}
      </div>
    </span>
  );
}
