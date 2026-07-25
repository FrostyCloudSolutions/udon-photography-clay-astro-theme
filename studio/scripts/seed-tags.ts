/**
 * Pre-create media-browser tags matching the site's categories, so
 * the client's Media tab starts with a familiar filing structure.
 * Safe to re-run (createIfNotExists with stable ids).
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-01'})

const TAGS = [
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

async function main() {
  for (const tag of TAGS) {
    const slug = tag.toLowerCase().replace(/\s+/g, '-')
    await client.createIfNotExists({
      _id: `media.tag-${slug}`,
      _type: 'media.tag',
      name: {_type: 'slug', current: tag},
    })
    console.log(`tag: ${tag}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
