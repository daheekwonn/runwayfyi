import { type SchemaTypeDefinition } from 'sanity'
import article from './article'
import show from './show'
import siteSettings from './siteSettings'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, show, siteSettings],
}
