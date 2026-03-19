// sanity/schemas/siteSettings.ts
// Singleton document for site-wide settings.
// Edit at runwayfyi.sanity.studio → Site Settings

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type ever exists
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'heroImage1',
      title: 'Hero Image 1 (left panel)',
      type: 'image',
      description: 'Left runway image on the homepage hero. Swap each season.',
      options: { hotspot: true },
    },
    {
      name: 'heroImage2',
      title: 'Hero Image 2 (right panel)',
      type: 'image',
      description: 'Right runway image on the homepage hero. Swap each season.',
      options: { hotspot: true },
    },
    {
      name: 'heroCaption1',
      title: 'Caption 1',
      type: 'string',
      description: 'e.g. "Valentino FW26 · Look 12"',
    },
    {
      name: 'heroCaption2',
      title: 'Caption 2',
      type: 'string',
      description: 'e.g. "Chanel FW26 · Look 04"',
    },
  ],
}
