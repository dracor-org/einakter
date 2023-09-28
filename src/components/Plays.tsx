import React, {useMemo} from 'react';
import {t} from '@lingui/macro';
import {Helmet} from 'react-helmet-async';
import {ColumnDef} from '@tanstack/react-table';
import {Play} from '../types';
import data from '../data.json';
import authors from '../authors.json';
import Statistics from './Statistics';
import Table from './Table';
import Authors from './Authors';
import TitleCell from './TitleCell';
import DownloadLink from './DownloadLink';
import {formatEra} from './Years';

function KeywordsCell ({keywords}: {keywords: string[]}) {
  return (
    <ul className="list-disc text-gray-400 text-sm">
      {keywords.map(text => (
        <li key={text}><span className="text-black">{text}</span></li>
      ))}
    </ul>
  );
}

export default function Plays () {
  const columns = useMemo<ColumnDef<Play>[]>(
    () => [
      {
        id: 'authors',
        header: t`Author`,
        accessorFn: row => {
          const {authors = []} = row;
          if (authors.length === 0) return 'Anonym';
          return authors.map(
            a => `${a.name || ''} ${a.pseudonym || ''} ${a.wikidata || ''}`
          ).join(' ');
        },
        cell: info => (
          <Authors authors={info.row.original.authors || []} withLink/>
        ),
      },
      {
        accessorKey: 'title',
        header: t`Title`,
        accessorFn: play => {
          const settings = play.settings?.map((s) => s.description).join(' ');
          let text = `${play.title} ${play.subtitle} ${settings}`;
          play.keywords?.forEach(k => text += ` ${k}`);
          play.cast?.forEach(c => text += ` ${c.name}`)
          return text;
        },
        cell: info => <TitleCell play={info.row.original} urlPath="/"/>,
      },
      {
        id: 'normalizedYear',
        header: t`Year (normalized)`,
        accessorFn: row => row.normalizedYear?.toString() || '',
        cell: info => <span>{formatEra(info.row.original.normalizedYear)}</span>
      },
      {
        id: 'numberOfScenes',
        header: t`Scenes`,
        accessorFn: row => row.numberOfScenes?.toString() || '',
      },
      {
        id: 'numberOfCharacters',
        header: t`Characters`,
        accessorFn: row => row.numberOfCharacters?.toString() || '',
      },
      {
        id: 'keywords',
        header: t`Keywords`,
        accessorFn: row => row.keywords?.join(' ') || '',
        cell: info => info.row.original.keywords ? (
          <KeywordsCell keywords={info.row.original.keywords}/>
        ) : <span/>,
      },
    ],
    []
  );

  return (
    <>
      <Helmet>
        <title>Einakter</title>
      </Helmet>
      <div className="p-4 overflow-x-auto">
        <Statistics plays={data} authors={authors} className="mb-2 mt-2"/>
        <div className="float-right mt-1">
          <DownloadLink
            href="data.json"
            title={t`Download JSON`}
            download="einakter.json"
          >
            JSON
          </DownloadLink>
          <DownloadLink
            href="data.csv"
            title={t`Download CSV`}
            download="einakter.csv"
          >
            CSV
          </DownloadLink>
        </div>
        <Table
          columns={columns}
          data={data}
          defaultSort={[{id: 'normalizedYear', desc: false}]}
        />
      </div>
    </>
  );
}
