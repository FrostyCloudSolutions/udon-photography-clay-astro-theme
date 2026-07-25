import {defineArrayMember, defineType} from 'sanity'

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
        ],
      },
    }),
    // Photos inside articles: 1–3 images rendered side by side.
    defineArrayMember({type: 'imageRow'}),
  ],
})
