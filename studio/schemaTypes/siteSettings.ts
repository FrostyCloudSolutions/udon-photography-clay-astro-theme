import {defineField, defineType} from 'sanity'
import {THEME_FONT_OPTIONS} from './fonts'

/**
 * Site-wide design settings — a single fixed document (id
 * "site-settings"), pinned at the bottom of the sidebar. Currently
 * holds the website-wide font theme; the in-editor Font menu's
 * "Site theme font" entry follows whatever is chosen here.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'fontTheme',
      title: 'Website font',
      type: 'string',
      description:
        "The main font for the whole website's text. Changing it restyles every page (live ~2 minutes after Publish). Text where you picked a specific font in the editor keeps that font.",
      options: {list: THEME_FONT_OPTIONS},
      initialValue: 'eb-garamond',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site settings'}),
  },
})
