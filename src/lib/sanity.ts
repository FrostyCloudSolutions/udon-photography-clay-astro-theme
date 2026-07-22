// Data layer for the Sanity Content Lake — replaces the Markdown
// content collections. All fetches happen at build time (getStaticPaths
// / page frontmatter), so the deployed site remains fully static; a
// Sanity publish triggers a rebuild via webhook rather than being read
// live.
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// The project id is not a secret (it appears in every public API URL);
// the env vars exist for configurability, with hardcoded fallbacks so
// builds work without any environment setup.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '3g68vjze';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-07-01',
  // Published content read at build time — the API CDN is exactly right.
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

// Derivative sizes. Sanity's image CDN resizes and re-encodes on the
// fly (auto('format') serves WebP/AVIF per browser), which is what
// lets the client upload 5–10MB originals without hurting the site.
export const cardImage = (source: SanityImageSource) =>
  builder.image(source).width(1200).auto('format').url(); // grid/tile backgrounds
export const thumbImage = (source: SanityImageSource) =>
  builder.image(source).width(400).auto('format').url(); // filmstrip thumbnails
export const largeImage = (source: SanityImageSource) =>
  builder.image(source).width(1600).auto('format').url(); // stage, lightbox, page images

// ---- Pages -----------------------------------------------------------

// The four fixed page documents (see studio structure builder).
export interface PagePayload {
  title: string;
  description: string | null;
  image: SanityImageSource | null;
  body: unknown | null; // portable text blocks
}

export function getPage(id: string): Promise<PagePayload | null> {
  return sanityClient.fetch(
    `*[_type == "page" && _id == $id][0]{title, description, image, body}`,
    { id },
  );
}

// The three homepage tiles are a design constant: each tile is one of
// these pages, showing that page's own image and title.
const HOME_TILE_IDS = ['page-about', 'page-portfolio', 'page-inquire'];

export interface HomeTile {
  slug: string; // 'about' | 'portfolio' | 'inquire'
  title: string;
  image: SanityImageSource | null;
}

export async function getHomeTiles(): Promise<HomeTile[]> {
  const docs: Array<{ _id: string; title: string; image: SanityImageSource | null }> =
    await sanityClient.fetch(`*[_type == "page" && _id in $ids]{_id, title, image}`, {
      ids: HOME_TILE_IDS,
    });
  return HOME_TILE_IDS.flatMap((id) => {
    const doc = docs.find((candidate) => candidate._id === id);
    if (!doc) return [];
    return [{ slug: id.replace('page-', ''), title: doc.title, image: doc.image }];
  });
}

// ---- Portfolio posts -------------------------------------------------

// A photo entry is a Sanity image object carrying our custom caption
// field alongside the asset reference.
export type PostPhoto = SanityImageSource & { caption?: string | null };

export interface PostSummary {
  title: string;
  slug: string;
  category: string;
  date: string;
  cover: PostPhoto | null; // first photo = grid thumbnail, by design
}

export interface PostFull extends PostSummary {
  description: string | null;
  photos: PostPhoto[] | null;
}

export function getPostSummaries(): Promise<PostSummary[]> {
  return sanityClient.fetch(`
    *[_type == "portfolioPost" && defined(slug.current)] | order(date desc) {
      title,
      "slug": slug.current,
      category,
      date,
      "cover": photos[0]
    }
  `);
}

export function getPostsFull(): Promise<PostFull[]> {
  return sanityClient.fetch(`
    *[_type == "portfolioPost" && defined(slug.current)] | order(date desc) {
      title,
      "slug": slug.current,
      category,
      date,
      description,
      photos,
      "cover": photos[0]
    }
  `);
}
