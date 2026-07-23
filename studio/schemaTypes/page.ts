import {defineField, defineType} from 'sanity'

/**
 * One of the four fixed site pages (Home, About, Portfolio, Inquire).
 * These exist as exactly four documents with fixed IDs (page-home,
 * page-about, page-portfolio, page-inquire), pinned individually in
 * the sidebar by the structure builder in sanity.config.ts — they are
 * never created or deleted from the Studio.
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The page heading, shown at the top of the page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description:
        'Short intro shown under the page title. Also used as the page description for search engines.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      description:
        "Optional. Shown on the page, and used as this page's tile on the homepage grid (About, Portfolio, and Inquire only).",
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      description: 'Main page text, shown below the image.',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'image'},
  },
})
