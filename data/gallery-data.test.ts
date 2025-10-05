import { describe, it, expect } from 'vitest';
import {
  galleryData,
  getGalleryItemCount,
  getGalleryItemBySlug,
  getGalleryItemIndex,
  getPreviousGalleryItem,
  getNextGalleryItem,
  getThumbnailUrl,
  getEnlargedImageUrl,
  getItemsForPreloading,
} from './gallery-data';

describe('gallery-data', () => {
  describe('galleryData', () => {
    it('should contain items', () => {
      expect(galleryData.length).toBeGreaterThan(0);
    });

    it('should have valid structure for each item', () => {
      galleryData.forEach((item) => {
        expect(item).toHaveProperty('slug');
        expect(item).toHaveProperty('imageAlt');
        expect(item).toHaveProperty('blurhash');
        expect(typeof item.slug).toBe('string');
        expect(typeof item.imageAlt).toBe('string');
        expect(typeof item.blurhash).toBe('string');
        expect(item.slug.length).toBeGreaterThan(0);
        expect(item.blurhash.length).toBeGreaterThan(0);
      });
    });

    it('should have unique slugs', () => {
      const slugs = galleryData.map((item) => item.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe('getGalleryItemCount', () => {
    it('should return the total number of items', () => {
      expect(getGalleryItemCount()).toBe(galleryData.length);
    });
  });

  describe('getGalleryItemBySlug', () => {
    it('should return the correct item for a valid slug', () => {
      const item = getGalleryItemBySlug('panels-gallery-zudo-blocks-025');
      expect(item).toBeDefined();
      expect(item?.slug).toBe('panels-gallery-zudo-blocks-025');
      expect(item?.blurhash).toBeTruthy();
    });

    it('should return undefined for an invalid slug', () => {
      const item = getGalleryItemBySlug('non-existent-slug');
      expect(item).toBeUndefined();
    });

    it('should find the first item', () => {
      const firstItemSlug = galleryData[0].slug;
      const item = getGalleryItemBySlug(firstItemSlug);
      expect(item).toBeDefined();
      expect(item?.slug).toBe(firstItemSlug);
    });

    it('should find the last item', () => {
      const lastItemSlug = galleryData[galleryData.length - 1].slug;
      const item = getGalleryItemBySlug(lastItemSlug);
      expect(item).toBeDefined();
      expect(item?.slug).toBe(lastItemSlug);
    });
  });

  describe('getGalleryItemIndex', () => {
    it('should return the correct index for a valid slug', () => {
      const firstItemSlug = galleryData[0].slug;
      expect(getGalleryItemIndex(firstItemSlug)).toBe(0);
      const index025 = galleryData.findIndex(
        (item) => item.slug === 'panels-gallery-zudo-blocks-025',
      );
      expect(getGalleryItemIndex('panels-gallery-zudo-blocks-025')).toBe(index025);
      const lastItemSlug = galleryData[galleryData.length - 1].slug;
      expect(getGalleryItemIndex(lastItemSlug)).toBe(galleryData.length - 1);
    });

    it('should return -1 for an invalid slug', () => {
      expect(getGalleryItemIndex('non-existent-slug')).toBe(-1);
    });
  });

  describe('getPreviousGalleryItem', () => {
    it('should return the previous item for a valid slug', () => {
      const prev = getPreviousGalleryItem('panels-gallery-zudo-blocks-025');
      expect(prev).toBeDefined();
      expect(prev?.slug).toBe('panels-gallery-zudo-blocks-024');
    });

    it('should return undefined for the first item', () => {
      const firstItemSlug = galleryData[0].slug;
      const prev = getPreviousGalleryItem(firstItemSlug);
      expect(prev).toBeUndefined();
    });

    it('should return undefined for an invalid slug', () => {
      const prev = getPreviousGalleryItem('non-existent-slug');
      expect(prev).toBeUndefined();
    });

    it('should work correctly for the second item', () => {
      if (galleryData.length > 1) {
        const secondItemSlug = galleryData[1].slug;
        const firstItemSlug = galleryData[0].slug;
        const prev = getPreviousGalleryItem(secondItemSlug);
        expect(prev).toBeDefined();
        expect(prev?.slug).toBe(firstItemSlug);
      }
    });
  });

  describe('getNextGalleryItem', () => {
    it('should return the next item for a valid slug', () => {
      const next = getNextGalleryItem('panels-gallery-zudo-blocks-025');
      expect(next).toBeDefined();
      expect(next?.slug).toBe('panels-gallery-zudo-blocks-026');
    });

    it('should return undefined for the last item', () => {
      const lastItemSlug = galleryData[galleryData.length - 1].slug;
      const next = getNextGalleryItem(lastItemSlug);
      expect(next).toBeUndefined();
    });

    it('should return undefined for an invalid slug', () => {
      const next = getNextGalleryItem('non-existent-slug');
      expect(next).toBeUndefined();
    });

    it('should work correctly for the second-to-last item', () => {
      const secondToLastIndex = galleryData.length - 2;
      const secondToLastSlug = galleryData[secondToLastIndex].slug;
      const lastSlug = galleryData[galleryData.length - 1].slug;
      const next = getNextGalleryItem(secondToLastSlug);
      expect(next).toBeDefined();
      expect(next?.slug).toBe(lastSlug);
    });
  });

  describe('getThumbnailUrl', () => {
    it('should generate correct thumbnail URL', () => {
      expect(getThumbnailUrl('panel-variations')).toBe(
        'https://takazudomodular.com/images/p/panel-variations/900w.webp',
      );
      expect(getThumbnailUrl('panels-gallery-zudo-blocks-025')).toBe(
        'https://takazudomodular.com/images/p/panels-gallery-zudo-blocks-025/900w.webp',
      );
    });
  });

  describe('getEnlargedImageUrl', () => {
    it('should generate correct enlarged image URL', () => {
      expect(getEnlargedImageUrl('panel-variations')).toBe(
        'https://takazudomodular.com/images/p/panel-variations/2000w.webp',
      );
      expect(getEnlargedImageUrl('panels-gallery-zudo-blocks-025')).toBe(
        'https://takazudomodular.com/images/p/panels-gallery-zudo-blocks-025/2000w.webp',
      );
    });
  });

  describe('getItemsForPreloading', () => {
    it('should return current + prev 2 + next 2 items for middle items', () => {
      const items = getItemsForPreloading('panels-gallery-zudo-blocks-025');
      expect(items).toHaveLength(5);
      expect(items[0].slug).toBe('panels-gallery-zudo-blocks-023');
      expect(items[1].slug).toBe('panels-gallery-zudo-blocks-024');
      expect(items[2].slug).toBe('panels-gallery-zudo-blocks-025'); // current
      expect(items[3].slug).toBe('panels-gallery-zudo-blocks-026');
      expect(items[4].slug).toBe('panels-gallery-zudo-blocks-027');
    });

    it('should handle first item correctly', () => {
      const firstItemSlug = galleryData[0].slug;
      const items = getItemsForPreloading(firstItemSlug);
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].slug).toBe(firstItemSlug); // current should be first in results
    });

    it('should handle second item correctly', () => {
      if (galleryData.length > 1) {
        const secondItemSlug = galleryData[1].slug;
        const items = getItemsForPreloading(secondItemSlug);
        expect(items.length).toBeGreaterThan(0);
        expect(items.includes(galleryData.find((item) => item.slug === secondItemSlug)!)).toBe(
          true,
        ); // should include current
      }
    });

    it('should handle last item correctly', () => {
      const lastItemSlug = galleryData[galleryData.length - 1].slug;
      const items = getItemsForPreloading(lastItemSlug);
      expect(items.length).toBeGreaterThan(0);
      expect(items[items.length - 1].slug).toBe(lastItemSlug); // current should be last in results
    });

    it('should handle second-to-last item correctly', () => {
      const secondToLastIndex = galleryData.length - 2;
      const secondToLastSlug = galleryData[secondToLastIndex].slug;
      const lastSlug = galleryData[galleryData.length - 1].slug;
      const items = getItemsForPreloading(secondToLastSlug);
      expect(items.length).toBeGreaterThan(0);
      expect(items.includes(galleryData.find((item) => item.slug === secondToLastSlug)!)).toBe(
        true,
      ); // should include current
      expect(items.includes(galleryData.find((item) => item.slug === lastSlug)!)).toBe(true); // should include last
    });

    it('should return empty array for invalid slug', () => {
      const items = getItemsForPreloading('non-existent-slug');
      expect(items).toHaveLength(0);
    });
  });
});
