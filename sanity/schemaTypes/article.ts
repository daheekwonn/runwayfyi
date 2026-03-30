import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Opinion', value: 'opinion' },
          { title: 'Data', value: 'data' },
          { title: 'Forecast', value: 'forecast' },
          { title: 'Cultural Context', value: 'cultural-context' },
          { title: 'Show Review', value: 'show-review' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
  name: 'section',
  title: 'Section',
  type: 'string',
  options: {
    list: [
      { title: 'Analysis', value: 'analysis' },
      { title: 'FYI', value: 'fyi' },
    ],
    layout: 'radio',
  },
  initialValue: 'analysis',
}),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Short summary shown on the homepage and analysis grid',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'trendScore',
      title: 'Trend Score (optional)',
      description: 'If this article is about a specific trend, enter its score',
      type: 'number',
    }),
    defineField({
  name: 'season',
  title: 'Season',
  type: 'string',
  options: {
    list: [
      { title: 'FW26', value: 'fw26' },
      { title: 'SS26', value: 'ss26' },
      { title: 'FW25', value: 'fw25' },
    ],
  },
  initialValue: 'fw26',
}),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'season' },
  },
})
