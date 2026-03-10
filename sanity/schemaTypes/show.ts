import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'show',
  title: 'Show',
  type: 'document',
  fields: [
    defineField({
      name: 'designer',
      title: 'Designer / House',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'designer', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'season',
      title: 'Season',
      type: 'string',
      options: {
        list: [
          { title: 'Paris FW26',      value: 'paris-fw26'      },
          { title: 'Milan FW26',      value: 'milan-fw26'      },
          { title: 'London FW26',     value: 'london-fw26'     },
          { title: 'New York FW26',   value: 'newyork-fw26'    },
          { title: 'Copenhagen FW26', value: 'copenhagen-fw26' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      options: {
        list: [
          { title: 'Paris',      value: 'Paris'      },
          { title: 'Milan',      value: 'Milan'      },
          { title: 'London',     value: 'London'     },
          { title: 'New York',   value: 'New York'   },
          { title: 'Copenhagen', value: 'Copenhagen' },
        ],
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'showScore',
      title: 'Show Score',
      type: 'number',
    }),
    defineField({
      name: 'runwayScore',
      title: 'Runway Component (out of 50)',
      type: 'number',
    }),
    defineField({
      name: 'searchScore',
      title: 'Search Component (out of 30)',
      type: 'number',
    }),
    defineField({
      name: 'socialScore',
      title: 'Social Component (out of 20)',
      type: 'number',
    }),
    defineField({
      name: 'notes',
      title: 'Editorial Notes',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'keyPieces',
      title: 'Key Pieces / Trends from this show',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'looks',
      title: 'Looks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'lookNumber', title: 'Look Number', type: 'number' },
            { name: 'image',      title: 'Image',       type: 'image', options: { hotspot: true } },
            { name: 'materials',  title: 'Materials',   type: 'array', of: [{ type: 'string' }] },
            { name: 'colours',    title: 'Colours',     type: 'array', of: [{ type: 'string' }] },
            { name: 'silhouette', title: 'Silhouette',  type: 'string' },
            { name: 'notes',      title: 'Notes',       type: 'string' },
          ],
          preview: {
            select: { title: 'lookNumber', media: 'image' },
            prepare(value: Record<string, any>) {
              return { title: `Look ${value.title}`, media: value.media }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'showDate',
      title: 'Show Date',
      type: 'date',
    }),
  ],
  preview: {
    select: { title: 'designer', subtitle: 'season', media: 'coverImage' },
  },
})
