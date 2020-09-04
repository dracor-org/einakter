import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Play} from '../types';
import data from '../plays';

const dataURI = 'data:text/json;base64,' +
  btoa(unescape(encodeURIComponent(JSON.stringify(data))));

function formatAuthor (_: string, play: Play) {
  const {name, pseudonym, wikidata: id} = play.author || {};
  return (
    <span>
      {name}
      {pseudonym && (<i> ({pseudonym})</i>)}
      <br/>
      {id && (
        <small>
          Wikidata:
          {' '}
          <a href={`https://www.wikidata.org/wiki/${id}`}>{id}</a>
        </small>
      )}
    </span>
  );
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
    dataField: 'author.name',
    text: 'Author',
    formatter: formatAuthor,
    filterValue: (cell: string | undefined, play: Play) => {
      if (cell === undefined) return 'Anonym';
      const {author: a} = play;
      return `${a.name} ${a.pseudonym} ${a.wikidata}`;
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
    sort: true
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
              <a href={dataURI} className="download" download="einakter.json" >
                <FontAwesomeIcon icon="download" title="Download JSON"/>
              </a>
            </span>
            <br/>
            <BootstrapTable
              { ...props.baseProps }
              bootstrap4
              defaultSortDirection="asc"
            />
          </div>
        )
      }
    </ToolkitProvider>
  );
}

export default Table;
