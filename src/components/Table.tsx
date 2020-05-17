import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import data from '../data.json';

interface Play {
  title: string
  subtitle?: string
  author: {
    name: string
    pseudonym?: string
    wikidata?: string
  }
  ids?: {
    dracor?: string
    wikidata?: string
  }
}

function formatAuthor (_: string, play: Play) {
  const {name, pseudonym, wikidata: id} = play.author || {};
  console.log(_, play);
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
  const {title, subtitle, ids = {}} = play;
  return (
    <span>
      <strong>{title}</strong>
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
    sort: true
  }, {
    dataField: 'title',
    text: 'Title',
    formatter: formatTitle,
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

  return (
    <div>
      <br/>
      <BootstrapTable
        bootstrap4
        keyField="slug"
        columns={columns}
        data={data}
        defaultSortDirection="asc"
      />
    </div>
  );
}

export default Table;
