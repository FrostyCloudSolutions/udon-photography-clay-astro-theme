import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * A row of 1–3 photos inside an article body (the two-column tile
 * look from the client's reference site, generalized to 1/2/3
 * columns). Rendered side by side on desktop, stacked on phones;
 * every photo opens fullscreen on click.
 */
export const imageRow = defineType({
  name: 'imageRow',
  title: 'Image row',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description:
        '1, 2, or 3 photos shown side by side (stacked on phones). Click a photo to add an optional caption.',
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
      validation: (rule) => rule.min(1).max(3).error('An image row holds 1 to 3 photos.'),
    }),
  ],
  preview: {
    select: {media: 'images.0', images: 'images'},
    prepare({media, images}) {
      const count = Array.isArray(images) ? images.length : 0
      return {title: `Image row (${count} photo${count === 1 ? '' : 's'})`, media}
    },
  },
})
