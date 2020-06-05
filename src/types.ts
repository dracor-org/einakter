export interface CastMember {
  name: string
  gender: string
  isGroup?: boolean
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

  cast?: CastMember[]
  comment?: string
  created?: number
  editions?: Edition[]
  ids?: {
    dracor?: string
    wikidata?: string
  }
  keywords?: string[]
  numberOfScenes?: number
  premiered?: string | number
  printed?: number
  setting?: string
  subtitle?: string
}
