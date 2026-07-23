/**
 * One-time seed: ports the old site's page copy and a few demo
 * portfolio posts (with images) from the Decap-era repo into the
 * Sanity dataset, so the branch preview isn't empty while the client
 * is unavailable. Safe to re-run (createOrReplace with fixed ids).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {createReadStream, readFileSync} from 'node:fs'
import {basename, join} from 'node:path'
import {randomUUID} from 'node:crypto'

const client = getCliClient({apiVersion: '2026-07-01'})
const SITE = join(__dirname, '..', '..', 'clay-astro-theme')

// ---- tiny helpers ----------------------------------------------------

const key = () => randomUUID().slice(0, 12)

/** Minimal front-matter reader: top-level `field: value` lines only. */
function frontMatter(md: string): {fields: Record<string, string>; body: string} {
  const match = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return {fields: {}, body: md}
  const fields: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/)
    if (kv) fields[kv[1]] = kv[2].replace(/^["']|["']$/g, '')
  }
  return {fields, body: match[2].trim()}
}

/** Markdown paragraphs → minimal portable text (headings + paragraphs). */
function toBlocks(markdown: string) {
  return markdown
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      const heading = paragraph.match(/^(#{1,3})\s+(.*)$/s)
      const style = heading ? (heading[1].length === 1 ? 'h2' : 'h3') : 'normal'
      const text = (heading ? heading[2] : paragraph).replace(/\n/g, ' ')
      return {
        _type: 'block',
        _key: key(),
        style,
        markDefs: [],
        children: [{_type: 'span', _key: key(), text, marks: []}],
      }
    })
}

/** Upload an image from public/img once; reuse across documents. */
const uploaded = new Map<string, string>()
async function imageRef(publicPath: string | undefined) {
  if (!publicPath) return null
  const file = basename(publicPath)
  if (!uploaded.has(file)) {
    const asset = await client.assets.upload('image', createReadStream(join(SITE, 'public', publicPath)), {
      filename: file,
    })
    uploaded.set(file, asset._id)
    console.log(`uploaded ${file} -> ${asset._id}`)
  }
  return {_type: 'image' as const, asset: {_type: 'reference' as const, _ref: uploaded.get(file)!}}
}

// ---- pages -----------------------------------------------------------

async function seedPage(id: string, mdFile: string, fallbackTitle: string) {
  const {fields, body} = frontMatter(readFileSync(join(SITE, 'src/content/pages', mdFile), 'utf8'))
  const image = await imageRef(fields.thumbnail)
  await client.createOrReplace({
    _id: id,
    _type: 'page',
    title: fields.title || fallbackTitle,
    description: fields.description || undefined,
    ...(image ? {image} : {}),
    ...(body ? {body: toBlocks(body)} : {}),
  })
  console.log(`page ${id} <- ${mdFile}`)
}

// ---- demo posts --------------------------------------------------------

/** Parse the photos list from a work entry's front matter. */
function parsePhotos(md: string): Array<{image: string; caption?: string}> {
  const photos: Array<{image: string; caption?: string}> = []
  const section = md.match(/\nphotos:\n([\s\S]*?)(?=\n[a-z]+:|\n---)/)
  if (!section) return photos
  let current: {image: string; caption?: string} | null = null
  for (const line of section[1].split('\n')) {
    const image = line.match(/-?\s*image:\s*(\S+)/)
    const caption = line.match(/caption:\s*(.+)$/)
    if (image) {
      current = {image: image[1]}
      photos.push(current)
    } else if (caption && current) {
      current.caption = caption[1].replace(/^["']|["']$/g, '')
    }
  }
  return photos
}

async function seedPost(mdFile: string) {
  const md = readFileSync(join(SITE, 'src/content/work', mdFile), 'utf8')
  const {fields} = frontMatter(md)
  const slug = mdFile.replace(/\.md$/, '')
  const photos = []
  for (const photo of parsePhotos(md)) {
    const ref = await imageRef(photo.image)
    if (ref) photos.push({...ref, _key: key(), ...(photo.caption ? {caption: photo.caption} : {})})
  }
  await client.createOrReplace({
    _id: `seed-post-${slug}`,
    _type: 'portfolioPost',
    title: `${fields.title} (demo)`,
    slug: {_type: 'slug', current: slug},
    date: fields.date || new Date().toISOString(),
    category: fields.category,
    description: fields.description || undefined,
    photos,
  })
  console.log(`post ${slug}: ${photos.length} photo(s)`)
}

// ---- run ---------------------------------------------------------------

async function main() {
  await seedPage('page-home', 'index.md', 'Udon Studio')
  await seedPage('page-about', 'about.md', 'About')
  await seedPage('page-portfolio', 'portfolio.md', 'Portfolio')
  await seedPage('page-inquire', 'inquire.md', 'Inquire')

  // A small spread across categories; titles marked (demo) so the
  // client knows they're deletable placeholders.
  await seedPost('first-smiles.md')
  await seedPost('garden-elopement.md')
  await seedPost('studio-maternity-portraits.md')
  await seedPost('an-afternoon-with-the-cat.md')
  await seedPost('backyard-gathering.md')

  console.log('seed complete')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
