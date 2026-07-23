import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * The eight site categories plus "Other". "Other" is intentionally
 * absent from the site's navbar submenu and portfolio filter bar —
 * such posts appear under "All" only. The first eight must stay in
 * sync with src/lib/categories.ts in the site repo.
 */
const CATEGORIES = [
  'Babies',
  'Maternity',
  'Events',
  'Weddings',
  'Pets',
  'Collaborative Art',
  'Commercial Work',
  'Workshops',
  'Other',
]

export const portfolioPost = defineType({
  name: 'portfolioPost',
  title: 'Portfolio Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'The post\'s web address: udonphoto.com/portfolio/<slug>. Click "Generate" to create it from the title.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Publish date',
      type: 'datetime',
      description: 'Pre-filled with now. Controls ordering in the portfolio grid (newest first).',
      // Sanity natively does what the Decap "Now" workaround faked:
      // new posts start with the current time, still editable.
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: CATEGORIES, layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      description:
        'All photos for this post, in display order — drag to rearrange. You can drop many files here at once. The FIRST photo is the thumbnail shown in the portfolio grid. Click a photo to add an optional caption.',
      // Members are plain `image` types (with a caption field defined
      // on the image itself) rather than wrapper objects — this is
      // what keeps native multi-file drag-and-drop working: dropping
      // 13 files creates 13 photos.
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional. Shown under the photo and in fullscreen view.',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).error('A post needs at least one photo.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description:
        'Intro paragraph shown between the title and the photos. Also used as the post description for search engines.',
    }),
  ],
  orderings: [
    {
      name: 'dateDesc',
      title: 'Publish date (newest first)',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'photos.0'},
  },
})
