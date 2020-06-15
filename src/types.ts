export interface CastGroupMember {
  name: string
  gender?: string
}

export interface CastMember {
  name?: string
  gender?: string // 'm' | 'f' | 'u' throws an error
  role?: string
  isGroup?: boolean
  group?: CastGroupMember[]
}

export interface Edition {
  title: string
  url?: string
}

export interface Play {
  author: {
    name?: string
    pseudonym?: string
    wikidata?: string
  }
  slug: string
  title: string

  basedOn?: string[]
  cast?: CastMember[]
  comments?: string[]
  created?: number
  editions?: Edition[]
  dictionaries?: {
    bibliographia?: string
    dramenlexikon?: string
    kotzebue?: string
  }
  formalia?: string[]
  ids?: {
    dracor?: string
    wikidata?: string
  }
  keywords?: string[]
  normalizedYear?: number
  numberOfCharacters?: number
  numberOfScenes?: number
  premiered?: string | number
  printed?: number
  setting?: string
  subtitle?: string
}
