import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import {Link} from 'react-router-dom';
import {Play} from '../types';
import data from '../data.json';

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
      let text = `${play.title} ${play.subtitle}`;
      play.keywords?.forEach(k => text += ` ${k}`);
      play.cast?.forEach(c => text += ` ${c.name}`)
      return text;
    },
    sort: true
  }, {
    dataField: 'numberOfScenes',
    text: 'Scenes',
    sort: true
  }, {
    dataField: 'printed',
    text: 'printed',
    sort: true
  }, {
    dataField: 'ids.wikidata',
    text: 'Wikidata',
    formatter: formatWikidata,
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
