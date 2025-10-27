// CDN URL utilities for Takazudo Modular images

/**
 * Base CDN URL for all images
 */
export const CDN_BASE_URL = 'https://takazudomodular.com';

/**
 * Image size types
 */
export type ImageSize = '600w' | '900w' | '1200w' | '1600w' | '2000w';

/**
 * Generate image URL for a given slug and size
 * Used for gallery images in /images/p/ directory
 */
export function getImageUrl(slug: string, size: ImageSize): string {
  return `${CDN_BASE_URL}/images/p/${slug}/${size}.webp`;
}

/**
 * Generate static image URL for a given slug and size
 * Used for static images in /static/images/p/ directory
 */
export function getStaticImageUrl(slug: string, size: ImageSize): string {
  return `${CDN_BASE_URL}/static/images/p/${slug}/${size}.webp`;
}

/**
 * Generate thumbnail URL for a gallery item (900w)
 */
export function getThumbnailUrl(slug: string): string {
  return getImageUrl(slug, '900w');
}

/**
 * Generate enlarged image URL for a gallery item (2000w)
 */
export function getEnlargedImageUrl(slug: string): string {
  return getImageUrl(slug, '2000w');
}
