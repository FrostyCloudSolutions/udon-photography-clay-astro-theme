import {defineArrayMember, defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {PostFormInput} from '../components/AutoArticleRows'
import {PhotosArrayInput} from '../components/PhotosArrayInput'

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
  // Auto-fills an empty Article body with photo rows (see component).
  components: {input: PostFormInput},
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
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description:
        'How this post displays: "Gallery slideshow" shows the photo filmstrip; "Article" mixes your text and photo rows like a blog post. Photos open fullscreen in both.',
      options: {
        list: [
          {title: 'Article (text and photos mixed)', value: 'article'},
          {title: 'Gallery slideshow', value: 'gallery'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      // New posts default to article style (client preference,
      // July 23); existing posts keep rendering as galleries until
      // she switches them — and a post with no article body written
      // yet falls back to the gallery on the site regardless.
      initialValue: 'article',
    }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'blockContent',
      description:
        'The article itself. When a post with photos switches to Article layout (and this is still empty), the photos are inserted automatically as rows of 2 — then write text between the rows, rearrange, or add more "Image row" blocks (1–3 photos each) wherever you like.',
      hidden: ({document}) => document?.layout !== 'article',
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      description:
        'All photos for this post, in display order — drag to rearrange. You can drop many files here at once, or use "Add many from library" to pick several already-uploaded photos in one go. The FIRST photo is the thumbnail shown in the portfolio grid (in Article layout, only that first photo is used, as the cover). Click a photo to add an optional caption.',
      components: {input: PhotosArrayInput},
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
    // Hidden ledger of photo keys already placed into the Article
    // body by the auto-insert (see components/AutoArticleRows) — rows
    // the editor deletes are never re-inserted.
    defineField({
      name: 'articleSyncedKeys',
      title: 'Article synced photo keys (auto-managed)',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      hidden: true,
    }),
    // Hidden rank written by the drag-to-reorder list in the sidebar.
    orderRankField({type: 'portfolioPost'}),
  ],
  orderings: [
    orderRankOrdering,
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
