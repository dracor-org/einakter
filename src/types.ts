export interface CastGroupMember {
  name: string;
  gender?: string;
  role?: string;
  isGroup?: boolean;
}

export interface CastMember {
  name?: string;
  gender?: string; // 'm' | 'f' | 'u' throws an error
  role?: string;
  isGroup?: boolean;
  group?: CastGroupMember[];
}

export interface Edition {
  title: string;
  url?: string;
}

export interface Author {
  name?: string;
  pseudonym?: string;
  wikidata?: string;
}

export interface Coords {
  longitude: number;
  latitude: number;
}

export interface Dict {
  name: string;
  pages?: string;
  url?: string;
}

export interface Setting {
  description: string;
  location:
    | {
        wikidataId: string;
        coordinates?: Coords;
      }
    | {
        coordinates: Coords;
        wikidataId?: string;
      };
}

export interface Play {
  id: string;
  slug: string;
  author?: Author;
  authors?: Author[];
  title: string;

  basedOn?: (string | OriginalPlay)[];
  basedOnLanguage?: string;
  cast?: CastMember[];
  comments?: string[];
  yearWritten?: number;
  yearPrinted?: number;
  yearNormalized?: number;
  premiered?: string | number;
  editions?: Edition[];
  dictionaries?: Dict[];
  formalia?: string[];
  ids?: {
    dracor?: string;
    wikidata?: string;
    weber?: string;
  };
  keywords?: string[];
  numberOfCharacters?: number;
  numberOfScenes?: number;
  reviews?: string[];
  settings?: Setting[];
  subtitle?: string;
}

export interface OriginalPlay {
  id: string;
  slug: string;
  author?: Author;
  authors?: Author[];
  title: string;
  subtitle?: string;
  language?: string;
  yearWritten?: number;
  yearPrinted?: number;
  premiered?: string | number;
  yearNormalized?: number;
  fulltextUrl?: string;
  ids?: {
    dracor?: string;
    wikidata?: string;
  };
  numTranslations?: number;
}

export interface SettingInfo {
  authors: Author[];
  title: string;
  slug: string;
  year?: number;
  setting: string;
}
