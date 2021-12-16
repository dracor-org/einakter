import React, {useEffect, useState} from 'react';
import {Trans} from '@lingui/macro';
import axios from 'axios';
import IdLink from './IdLink';
import {formatYear} from './Years';

const endpoint = 'https://query.wikidata.org/sparql';

interface Props {
  fullname: string
  wikidataId: string
};

interface Info {
  name: string
  imageUrl?: string
  commonsPage?: string
  birth?: string[]
  death?: string[]
  gender?: string
};

const AuthorInfo = ({fullname, wikidataId}: Props) => {
  const [info, setInfo] = useState<Info|null>(null);

  useEffect(() => {
    async function fetchInfo(id: string) {
      const sparql = `
SELECT ?author ?authorLabel ?birthDate ?deathDate ?gender ?genderLabel
  ?birthPlace ?birthPlaceLabel ?birthCoord
  ?deathPlace ?deathPlaceLabel ?deathCoord
  ?img ?gnd
WHERE {
  BIND (wd:${id} AS ?author)
  OPTIONAL { ?author wdt:P569 ?birthDate. }
  OPTIONAL { ?author wdt:P570 ?deathDate. }
  OPTIONAL { ?author wdt:P21 ?gender. }
  OPTIONAL { ?author wdt:P19 ?birthPlace. }
  OPTIONAL { ?author wdt:P20 ?deathPlace. }
  #OPTIONAL { ?birthPlace wdt:P625 ?birthCoord. }
  OPTIONAL { ?author wdt:P18 ?img. }
  OPTIONAL { ?author wdt:P227 ?gnd. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
`;

      const url = `${endpoint}?query=${encodeURIComponent(sparql)}`;
      // console.log(`${id}`);
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          const sparqlResults = response.data.results?.bindings || [];

          const {
            authorLabel,
            img,
            birthDate,
            birthPlaceLabel,
            deathDate,
            deathPlaceLabel,
          } = sparqlResults[0];

          const birth = [];
          const death = [];

          if (birthDate?.value) {
            birth.push(
              formatYear(birthDate?.value.replace(/^(-?\d{4}).*$/, '$1'))
            );
          }
          if (birthPlaceLabel?.value) birth.push(birthPlaceLabel.value);

          if (deathDate?.value) {
            death.push(
              formatYear(deathDate?.value.replace(/^(-?\d{4}).*$/, '$1'))
            );
          }
          if (deathPlaceLabel?.value) death.push(deathPlaceLabel.value);

          const aInfo: Info = { name: authorLabel.value, birth, death };

          if (img?.value) {
            aInfo.imageUrl = img.value.replace(/^http:/, 'https:');
            aInfo.commonsPage = img.value
              .replace(/Special:FilePath\//, 'File:')
              .replace(/^http:/, 'https:');
          }

          setInfo(aInfo);
        } else {
          console.log(response.status);
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (wikidataId) fetchInfo(wikidataId);
  }, [wikidataId]);

  const {name, imageUrl, commonsPage, birth = [], death = []} = info || {};

  return (
    <div className="author-info flex">
      <div className="author-image">
        {imageUrl && <img src={imageUrl} title={name} alt="" width="50" />}
        {commonsPage && (
          <a href={commonsPage} title="© Wikimedia Commons">
            <img
              src="/commons-logo.svg"
              width="17"
              alt="Wikimedia Commons"
            />
          </a>
        )}
      </div>
      <span>
        <h2>{fullname}</h2>
        {wikidataId && (
          <p className="text-sm inline-flex bg-white rounded px-1.5 gap-1 align-text-bottom">
            <img src="/wikidata.svg" width="16" alt="wikidata"/>
            <IdLink id={wikidataId} type="wikidata"/>
          </p>
        )}
        {birth.length > 0 && <p><Trans>b.</Trans> {birth.join(', ')}</p>}
        {death.length > 0 && <p><Trans>d.</Trans> {death.join(', ')}</p>}
      </span>
    </div>
  );
};

export default AuthorInfo;
