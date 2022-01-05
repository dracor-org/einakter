import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {t} from '@lingui/macro';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import Authors from './Authors';
import IdLink from './IdLink';
import OriginalStatistics from './OriginalStatistics';
import {EinakterContext} from '../context';
import {Play, OriginalPlay} from '../types';
import {localLanguageName} from '../languages';

function formatAuthor (_: string, play: OriginalPlay) {
  return <Authors authors={play.authors || []} withLink/>;
}

function formatTitle (_: string, play: OriginalPlay) {
  const {title, subtitle, id, ids: {dracor, wikidata} = {}} = play;
  return (
    <span>
      <Link className="text-lg" to={`/originals/${id}`}>{title}</Link>
      {subtitle && <small><br/>{subtitle}</small>}
      <div>
      {wikidata && (
        <small>
          <IdLink id={wikidata} type="wikidata"/>
        </small>
      )}
      {' '}
      {dracor && (
        <small>
          <IdLink id={dracor} type="dracor"/>
        </small>
      )}
      </div>
    </span>
  );
}

function Originals () {
  const {plays, originals} = useContext(EinakterContext);

  const numbers: {[id: string]: number} = {}
  plays.forEach(p => {
    p.basedOn?.forEach((o: OriginalPlay | string) => {
      if (typeof o !== 'string' && o.id) {
        const id = o.id;
        if (numbers[id]) {
          numbers[id]++;
        } else {
          numbers[id] = 1;
        }
      }
    });
  });

  const data = originals.map((o: OriginalPlay) => {
    const numTranslations = numbers[o.id] || 0;
    return {...o, numTranslations};
  });

  const columns = [{
    dataField: 'authors[0].name',
    text: t`Author`,
    formatter: formatAuthor,
    filterValue: (cell: string | undefined, play: Play) => {
      if (cell === undefined) return 'Anonym';
      const {authors = []} = play;
      return authors.map(a => `${a.name || ''} ${a.pseudonym || ''} ${a.wikidata || ''}`).join(' ');
    },
    sort: true
  }, {
    dataField: 'title',
    text: t`Title`,
    formatter: formatTitle,
    filterValue: (_: string, play: Play) => {
      let text = `${play.title} ${play.subtitle}`;
      return text;
    },
    sort: true
  }, {
    dataField: 'normalizedYear',
    text: t`Year (normalized)`,
    sort: true,
    sortFunc: (a: number, b: number, order: string) => {
      if (!a) {
        return order === 'asc' ? -1 : 1;
      }

      if (!b) {
        return order === 'asc' ? 1 : -1;
      }

      return order === 'asc' ? a - b : b - a;
    }
  }, {
    dataField: 'language',
    text: t`Language`,
    formatter: (code: string) => localLanguageName(code),
    filterValue: (code: string) => localLanguageName(code),
    sort: true
  }, {
    dataField: 'numTranslations',
    text: t`Number of translations`,
    sort: true
  }]
  
  const { SearchBar } = Search;
  
  return (
    <div className="p-4 overflow-x-auto">
      <Helmet>
        <title>Einakter: Originals</title>
      </Helmet>
      <ToolkitProvider
        keyField='id'
        data={data}
        columns={columns}
        search
      >
        {
          props => (
            <div>
              <OriginalStatistics plays={originals} className="mb-2"/>
              <SearchBar { ...props.searchProps } placeholder={t`Search`} />
              <BootstrapTable
                { ...props.baseProps }
                bootstrap4
                defaultSorted={[
                  { dataField: 'normalizedYear', order: 'asc' }
                ]}
                defaultSortDirection="asc"
              />
            </div>
          )
        }
      </ToolkitProvider>
    </div>
  );
}

export default Originals;
