// Helpers for the portfolio "photos" list (image + optional thumbnail flag).
// Older entries that predate the photos field fall back to the legacy
// single `thumbnail` string, which the pages collection still uses too.

export interface PostPhoto {
  image: string;
  thumbnail?: boolean;
}

interface PhotoFields {
  photos?: PostPhoto[];
  thumbnail?: string;
}

export function postThumbnail(data: PhotoFields): string | undefined {
  if (data.photos?.length) {
    return (data.photos.find((p) => p.thumbnail) ?? data.photos[0]).image;
  }
  return data.thumbnail;
}
