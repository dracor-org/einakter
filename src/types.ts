export interface Play {
  title: string
  subtitle?: string
  slug: string
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
