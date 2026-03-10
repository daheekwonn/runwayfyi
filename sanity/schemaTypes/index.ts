import { type SchemaTypeDefinition } from 'sanity'
import article from './article'
import show from './show'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, show],
}
