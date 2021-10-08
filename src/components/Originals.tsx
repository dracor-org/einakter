import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import Authors from './Authors';
import IdLink from './IdLink';
import {EinakterContext} from '../context';
import {Play, OriginalPlay} from '../types';
import {languages} from '../utils';

function formatAuthor (_: string, play: OriginalPlay) {
  return <Authors authors={play.authors || []} withLink/>;
}

function formatTitle (_: string, play: OriginalPlay) {
  const {title, subtitle, id = {}} = play;
  return (
    <span>
      <Link to={`/originals/${id}`}>{title}</Link>
      {subtitle && <small><br/>{subtitle}</small>}
    </span>
  );
}

function formatWikidata (id: any | undefined) {
  return id ? (
    <small>
      <IdLink id={id} type="wikidata"/>
    </small>
  ) : <i/>; // we need to return an element to avoid a typescript error
}

function Table () {
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
    text: 'Author',
    formatter: formatAuthor,
    filterValue: (cell: string | undefined, play: Play) => {
      if (cell === undefined) return 'Anonym';
      const {authors = []} = play;
      return authors.map(a => `${a.name || ''} ${a.pseudonym || ''} ${a.wikidata || ''}`).join(' ');
    },
    sort: true
  }, {
    dataField: 'title',
    text: 'Title',
    formatter: formatTitle,
    filterValue: (_: string, play: Play) => {
      let text = `${play.title} ${play.subtitle}`;
      return text;
    },
    sort: true
  }, {
    dataField: 'normalizedYear',
    text: 'Year (normalized)',
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
    dataField: 'ids.wikidata',
    text: 'Wikidata',
    formatter: formatWikidata,
    sort: false
  }, {
    dataField: 'language',
    text: 'Language',
    formatter: (code: string) => languages[code] || code,
    filterValue: (code: string) => languages[code] || code,
    sort: true
  }, {
    dataField: 'numTranslations',
    text: 'Number of translations',
    sort: true
  }]
  
  const { SearchBar } = Search;
  
  return (
    <>
      <Helmet>
        <title>Einakter: Originals</title>
      </Helmet>
      <h1>Originals</h1>
      <ToolkitProvider
        keyField='id'
        data={data}
        columns={columns}
        search
      >
        {
          props => (
            <div>
              <SearchBar { ...props.searchProps } />
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
    </>
  );
}

export default Table;
