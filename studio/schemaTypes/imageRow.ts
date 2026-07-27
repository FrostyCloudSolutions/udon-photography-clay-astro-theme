import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * A photo grid inside an article body: any number of photos (up to
 * 12) arranged in a chosen number of columns (1–4), wrapping into
 * rows automatically — e.g. 4 photos + 2 columns = a 2x2 grid,
 * 3 photos + 1 column = three full-width photos stacked. Columns
 * collapse on phones; every photo opens fullscreen on click.
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
        'Up to 12 photos. They arrange into the number of columns chosen below, wrapping onto new rows automatically. Click a photo to add an optional caption.',
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
      validation: (rule) => rule.min(1).max(12).error('An image row holds 1 to 12 photos.'),
    }),
    defineField({
      name: 'columns',
      title: 'Photos per row',
      type: 'number',
      description:
        '1 = full-width photos stacked; 2, 3, or 4 = side-by-side columns (e.g. 4 photos with 2 per row makes a 2x2 grid). On phones, multi-column grids stack.',
      options: {list: [1, 2, 3, 4], layout: 'radio', direction: 'horizontal'},
      initialValue: 1,
      validation: (rule) => rule.min(1).max(4),
    }),
  ],
  preview: {
    select: {media: 'images.0', images: 'images', columns: 'columns'},
    prepare({media, images, columns}) {
      const count = Array.isArray(images) ? images.length : 0
      const cols = columns ?? Math.min(Math.max(count, 1), 3)
      return {
        title: `Image row (${count} photo${count === 1 ? '' : 's'}, ${cols} per row)`,
        media,
      }
    },
  },
})
