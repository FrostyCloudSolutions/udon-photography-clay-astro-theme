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
  // Builds are publish-triggered (Sanity webhook -> rebuild), so the
  // API's CDN cache can lag the just-published content — the July
  // stale-first-build retry loops were exactly this. Direct API reads
  // cost milliseconds at build time and are always fresh.
  useCdn: false,
});

const builder = imageUrlBuilder(sanityClient);

// Derivative sizes. Sanity's image CDN resizes and re-encodes on the
// fly (auto('format') serves WebP/AVIF per browser), which is what
// lets the client upload 5–10MB originals without hurting the site.
// Card/tile images request a fixed-aspect CROP: with both dimensions
// set, the CDN centers the crop on each image's hotspot — so the
// focal point the client sets with the Studio's crop tool controls
// what shows in the grid thumbnails.
export const cardImage = (source: SanityImageSource) =>
  builder.image(source).width(1200).height(900).fit('crop').auto('format').url();
export const thumbImage = (source: SanityImageSource) =>
  builder.image(source).width(400).auto('format').url(); // filmstrip thumbnails
export const largeImage = (source: SanityImageSource) =>
  builder.image(source).width(1600).auto('format').url(); // stage, lightbox, page images

// Article image-row derivatives: sized to the column count so a
// 3-across row doesn't download 3 full-width images.
export const rowImage = (source: SanityImageSource, columns: number) =>
  builder
    .image(source)
    .width(columns >= 3 ? 700 : columns === 2 ? 900 : 1600)
    .auto('format')
    .url();

// ---- Site settings ---------------------------------------------------

export interface SiteSettings {
  fontTheme: string | null;
}

export function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch(`*[_id == "site-settings"][0]{fontTheme}`);
}

// Every font key used by Font marks in any published body — the
// build loads only these (plus the base fonts). See src/lib/fonts.ts.
export async function getUsedFontKeys(): Promise<string[]> {
  const keys: Array<string | null> = await sanityClient.fetch(
    `array::unique(*[_type in ["portfolioPost", "page"]].body[].markDefs[_type == "font"].family)`,
  );
  return (keys ?? []).filter((key): key is string => Boolean(key));
}

// ---- Pages -----------------------------------------------------------

// The four fixed page documents (see studio structure builder).
export interface PagePayload {
  title: string;
  description: string | null;
  image: SanityImageSource | null;
  body: unknown | null; // portable text blocks
}

// NOTE on defined(asset) filters throughout: a document can be
// published while an image upload is still in progress, leaving an
// image entry with no asset. Unfiltered, those entries crash the
// image URL builder and FAIL the whole production build (July 26
// incident: site frozen for hours while the client kept publishing).
export function getPage(id: string): Promise<PagePayload | null> {
  return sanityClient.fetch(
    `*[_type == "page" && _id == $id][0]{
      title,
      description,
      "image": select(defined(image.asset) => image),
      body[]{
        ...,
        _type == "imageRow" => {
          ...,
          "images": images[defined(asset)]
        }
      }
    }`,
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
    await sanityClient.fetch(
      `*[_type == "page" && _id in $ids]{_id, title, "image": select(defined(image.asset) => image)}`,
      { ids: HOME_TILE_IDS },
    );
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
  orderRank: string | null; // set by drag-to-reorder in the Studio
}

export interface PostFull extends PostSummary {
  description: string | null;
  photos: PostPhoto[] | null;
  layout: 'gallery' | 'article' | null;
  body: unknown | null; // portable text (article layout)
}

// Grid order: posts the client has dragged into place follow her
// order; posts never dragged (no orderRank yet — e.g. brand-new
// ones) appear first, newest first, until she positions them.
function sortPosts<T extends { date: string; orderRank: string | null }>(posts: T[]): T[] {
  const ranked = posts
    .filter((post) => post.orderRank)
    .sort((a, b) => (a.orderRank! < b.orderRank! ? -1 : 1));
  const unranked = posts
    .filter((post) => !post.orderRank)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return [...unranked, ...ranked];
}

export async function getPostSummaries(): Promise<PostSummary[]> {
  const posts: PostSummary[] = await sanityClient.fetch(`
    *[_type == "portfolioPost" && defined(slug.current)] {
      title,
      "slug": slug.current,
      category,
      date,
      orderRank,
      "cover": photos[defined(asset)][0]
    }
  `);
  return sortPosts(posts);
}

export async function getPostsFull(): Promise<PostFull[]> {
  const posts: PostFull[] = await sanityClient.fetch(`
    *[_type == "portfolioPost" && defined(slug.current)] {
      title,
      "slug": slug.current,
      category,
      date,
      orderRank,
      description,
      "photos": photos[defined(asset)],
      layout,
      body[]{
        ...,
        _type == "imageRow" => {
          ...,
          "images": images[defined(asset)]
        }
      },
      "cover": photos[defined(asset)][0]
    }
  `);
  return sortPosts(posts);
}
