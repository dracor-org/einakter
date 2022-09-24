import React, {useContext, useMemo} from 'react';
import {Helmet} from 'react-helmet-async';
import {t} from '@lingui/macro';
import {ColumnDef} from '@tanstack/react-table';
import {EinakterContext} from '../context';
import {OriginalPlay} from '../types';
import {localLanguageName} from '../languages';
import OriginalStatistics from './OriginalStatistics';
import Table from './Table';
import Authors from './Authors';
import TitleCell from './TitleCell';

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

  const columns = useMemo<ColumnDef<OriginalPlay>[]>(
    () => [
      {
        id: 'authors',
        header: t`Author`,
        accessorFn: (row) => {
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
        cell: info => <TitleCell play={info.row.original}/>,
      },
      {
        id: 'normalizedYear',
        header: t`Year (normalized)`,
        accessorFn: row => row.normalizedYear?.toString() || '',
      },
      {
        id: 'language',
        header: t`Language`,
        accessorFn: row => localLanguageName(row.language || ''),
      },
      {
        id: 'numTranslations',
        header: t`Number of translations`,
        accessorFn: row => row.numTranslations?.toString() || '0',
      },
    ],
    []
  );

  return (
    <div className="p-4 overflow-x-auto">
      <Helmet>
        <title>Einakter: Originals</title>
      </Helmet>
      <div>
        <OriginalStatistics plays={originals} className="mb-2"/>
        <Table
          columns={columns}
          data={data}
          defaultSort={[{id: 'normalizedYear', desc: false}]}
        />
      </div>
    </div>
  );
}

export default Originals;
