import {defineConfig} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {schemaTypes} from './schemaTypes'

/**
 * The four site pages exist as exactly four documents with these
 * fixed IDs. The sidebar pins each one directly at the root (no
 * "Pages" folder), per the agreed layout:
 *
 *   Home / About / Portfolio / Inquire / ─── / Portfolio Posts
 */
const SITE_PAGES = [
  {id: 'page-home', title: 'Home'},
  {id: 'page-about', title: 'About'},
  {id: 'page-portfolio', title: 'Portfolio'},
  {id: 'page-inquire', title: 'Inquire'},
]

const pageItem = (S: StructureBuilder, id: string, title: string) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.document().schemaType('page').documentId(id).title(title))

export default defineConfig({
  name: 'default',
  title: 'Udon Studio',

  projectId: '3g68vjze',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            ...SITE_PAGES.map((page) => pageItem(S, page.id, page.title)),
            S.divider(),
            // Drag-to-reorder list: the order set here IS the site's
            // portfolio grid order (posts never dragged yet appear
            // newest-first at the front).
            orderableDocumentListDeskItem({
              type: 'portfolioPost',
              title: 'Portfolio Posts',
              S,
              context,
            }),
            S.divider(),
            S.listItem()
              .title('Site settings')
              .id('site-settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('site-settings')
                  .title('Site settings'),
              ),
          ]),
    }),
    // Media browser: search, filters, and tag-based organization for
    // all uploaded images; adds a "Media" tab and becomes the asset
    // picker when choosing existing images.
    media(),
    // GROQ query playground under the "Vision" tab — dev tool, safe to ignore.
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Pages and Site settings are fixed documents: hide them from the
    // global create (+) menu, and remove destructive actions so they
    // can't be deleted or duplicated from the UI.
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter(
            (template) => !['page', 'siteSettings'].includes(template.templateId),
          )
        : prev,
    actions: (prev, {schemaType}) =>
      ['page', 'siteSettings'].includes(schemaType)
        ? prev.filter(
            ({action}) => !['delete', 'duplicate', 'unpublish'].includes(action ?? ''),
          )
        : prev,
  },
})
