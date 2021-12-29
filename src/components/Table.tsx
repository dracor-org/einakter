import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import {Link} from 'react-router-dom';
import {Trans, t} from '@lingui/macro';
import {Helmet} from 'react-helmet';
import Authors from './Authors';
import Statistics from './Statistics';
import IdLink from './IdLink';
import {Play} from '../types';
import data from '../data.json';
import authors from '../authors.json';

function formatAuthor (_: string, play: Play) {
  return <Authors authors={play.authors || []} withLink/>;
}

function formatTitle (_: string, play: Play) {
  const {title, subtitle, slug, ids: {wikidata, dracor} = {}} = play;
  return (
    <span>
      <Link  className="text-lg"  to={`/${slug}`}>{title}</Link>
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

function Table () {
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
      const settings = play.settings?.map((s) => s.description).join(' ');
      let text = `${play.title} ${play.subtitle} ${settings}`;
      play.keywords?.forEach(k => text += ` ${k}`);
      play.cast?.forEach(c => text += ` ${c.name}`)
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
    dataField: 'numberOfScenes',
    text: t`Scenes`,
    sort: true
  }, {  
    dataField: 'numberOfCharacters',
    text: t`Characters`,
    sort: true
  }, {
    dataField: 'keywords',
    text: t`Keywords`,
    formatter: formatKeywords,
    sort: false
  }]
  
  const { SearchBar } = Search;
  
  return (
    <>
      <Helmet>
        <title>Einakter</title>
      </Helmet>
      <ToolkitProvider
        keyField='slug'
        data={data}
        columns={columns}
        search
      >
        {
          props => (
            <div className="p-4 overflow-x-auto">
              <h1>
                <Trans>Welcome</Trans>
              </h1>
              <p>
                <Trans>
                  Welcome to <b>Einakter</b>, the <b>Database of German-Language
                  One-Act Plays 1740–1850</b>, edited by Dîlan Canan Çakir and
                  Frank Fischer. Our aim is to provide a general quantitative
                  overview of one-act plays written in German between the
                  mid-18th and mid-19th centuries. For more information,
                  including how to cite this database, please see
                  the <Link to="/about">About</Link> page.
                </Trans>
              </p>
              <Statistics plays={data} authors={authors} className="mb-2 mt-2"/>
              <span className="flex justify-between items-center">
                <SearchBar className="m-0" { ...props.searchProps } placeholder={t`Search`}/>
                <span>
                  <a className="bg-primary px-2 py-1 ml-3 rounded-md text-neutral-100 drop-shadow-lg hover:drop-shadow-md hover:text-secondary-100 transition ease-in-out" href="data.json" download="einakter.json" title={t`Download JSON`}>
                    JSON
                  </a>
                  <a className="bg-primary px-2 py-1 ml-3 rounded-md text-neutral-100 drop-shadow-lg hover:drop-shadow-md hover:text-secondary-100 transition ease-in-out" href="data.csv" download="einakter.csv" title={t`Download CSV`}>
                    CSV
                  </a>
                </span>
              </span>
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
