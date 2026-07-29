import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

// This @sanity/icons version only exports the `icons` map (no named
// per-icon exports — the .d.ts lists them but the runtime bundle
// doesn't, which fails the deploy build).
const PlayIcon = icons.play

// Streaming-only video policy (July 27 update, Feature 3 / Task 6):
// videos live on YouTube or Vimeo and stream from there through an
// embedded player. No video files are ever uploaded to Sanity — raw
// files would have no transcoding/adaptive streaming and would burn
// through the plan's bandwidth allowance.
const VIDEO_HOSTS = [
  'youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'vimeo.com',
  'player.vimeo.com',
]

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'Video link',
      description:
        'Paste a YouTube or Vimeo link, e.g. https://www.youtube.com/watch?v=… — the video plays right on the page.',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['http', 'https']})
          .custom((value) => {
            if (!value) return true
            let host: string
            try {
              host = new URL(value).hostname.replace(/^(www|m)\./, '')
            } catch {
              return 'Not a valid link'
            }
            return VIDEO_HOSTS.some((h) => host === h || host.endsWith('.' + h))
              ? true
              : 'Only YouTube and Vimeo links work here (e.g. https://www.youtube.com/watch?v=…)'
          }),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
    }),
  ],
  preview: {
    select: {url: 'url', caption: 'caption'},
    prepare({url, caption}) {
      return {
        title: caption || 'Video',
        subtitle: url,
        media: PlayIcon,
      }
    },
  },
})
