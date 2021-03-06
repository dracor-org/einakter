import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Authors from './Authors';
import {Play} from '../types';
import data from '../data.json';

function formatAuthor (_: string, play: Play) {
  return <Authors authors={play.authors || []}/>;
}

function formatTitle (_: string, play: Play) {
  const {title, subtitle, slug = {}} = play;
  return (
    <span>
      <Link to={`/${slug}`}>{title}</Link>
      {subtitle && <small><br/>{subtitle}</small>}
    </span>
  );
}

function formatKeywords (_: string, play: Play) {
  const {keywords} = play;
  return keywords ? (
    <ul>
      {keywords.map(text => (
        <li key={text}><small>{text}</small></li>
      ))}
    </ul>
  ) : <span/>;
}

function formatWikidata (id: any | undefined) {
  return id ? (
    <small>
      <a href={`https://www.wikidata.org/wiki/${id}`}>{id}</a>
    </small>
  ) : <i/>; // we need to return an element to avoid a typescript error
}

function Table () {
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
      let text = `${play.title} ${play.subtitle} ${play.setting}`;
      play.keywords?.forEach(k => text += ` ${k}`);
      play.cast?.forEach(c => text += ` ${c.name}`)
      return text;
    },
    sort: true
  }, {
    dataField: 'numberOfCharacters',
    text: 'Characters',
    sort: true
  }, {
    dataField: 'numberOfScenes',
    text: 'Scenes',
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
    dataField: 'keywords',
    text: 'Keywords',
    formatter: formatKeywords,
    sort: false
  }]
  
  const { SearchBar } = Search;
  
  const total = data.reduce((sum: number, play: Play) => {
    return sum + (play.numberOfCharacters || 0);
  }, 0);

  return (
    <ToolkitProvider
      keyField='slug'
      data={data}
      columns={columns}
      search
    >
      {
        props => (
          <div>
            <br/>
            <SearchBar { ...props.searchProps } />
            <span className="counter">
              Database currently containing {data.length} one-act plays
              {' '}
              featuring {total} characters
              {' '}
              <a href="data.json" className="download" download="einakter.json">
                <FontAwesomeIcon icon="download" title="Download JSON"/>
              </a>
              {' '}
              <a href="data.csv" className="download" download="einakter.csv">
                <FontAwesomeIcon icon="file-csv" title="Download CSV"/>
              </a>
            </span>
            <br/>
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
  );
}

export default Table;
