import {defineArrayMember, defineField, defineType} from 'sanity'
import {COLOR_OPTIONS, FONT_OPTIONS} from './fonts'

/**
 * Shared rich-text ("portable text") definition used by page bodies
 * and article-layout post bodies. Paragraphs, two heading levels,
 * bold/italic, links — plus insertable Image rows (1–3 photos side
 * by side), which is how photos flow through article-style content.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading', value: 'h2'},
        {title: 'Subheading', value: 'h3'},
      ],
      lists: [
        {title: 'Bullet list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.uri({scheme: ['http', 'https', 'mailto']}),
              },
            ],
          },
          // Typography controls (Design Decision 3): select text, pick
          // Font or Color from the toolbar. Removing the mark returns
          // the text to the site defaults.
          {
            name: 'font',
            title: 'Font',
            type: 'object',
            fields: [
              defineField({
                name: 'family',
                title: 'Font',
                type: 'string',
                options: {list: FONT_OPTIONS},
                initialValue: 'theme',
              }),
            ],
          },
          {
            name: 'textColor',
            title: 'Color',
            type: 'object',
            fields: [
              defineField({
                name: 'value',
                title: 'Color',
                type: 'string',
                options: {list: COLOR_OPTIONS},
                initialValue: 'base',
              }),
            ],
          },
        ],
      },
    }),
    // Photos inside articles: 1–3 images rendered side by side.
    defineArrayMember({type: 'imageRow'}),
    // Videos: a pasted YouTube/Vimeo link, streamed via embed —
    // never an uploaded file (July 27 update, Task 6).
    defineArrayMember({type: 'videoEmbed'}),
  ],
})
