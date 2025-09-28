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
    it('should contain 227 items', () => {
      expect(galleryData).toHaveLength(227);
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
      expect(getGalleryItemCount()).toBe(227);
    });
  });

  describe('getGalleryItemBySlug', () => {
    it('should return the correct item for a valid slug', () => {
      const item = getGalleryItemBySlug('panels-gallery-zudo-blocks-025');
      expect(item).toBeDefined();
      expect(item?.slug).toBe('panels-gallery-zudo-blocks-025');
      expect(item?.blurhash).toBe('UgCQm4D+azay2NaKa#azLzfkfkj[ssjsj[fk');
    });

    it('should return undefined for an invalid slug', () => {
      const item = getGalleryItemBySlug('non-existent-slug');
      expect(item).toBeUndefined();
    });

    it('should find the first item', () => {
      const item = getGalleryItemBySlug('panel-variations');
      expect(item).toBeDefined();
      expect(item?.slug).toBe('panel-variations');
    });

    it('should find the last item', () => {
      const item = getGalleryItemBySlug('panels-gallery-zudo-blocks-093');
      expect(item).toBeDefined();
      expect(item?.slug).toBe('panels-gallery-zudo-blocks-093');
    });
  });

  describe('getGalleryItemIndex', () => {
    it('should return the correct index for a valid slug', () => {
      expect(getGalleryItemIndex('panel-variations')).toBe(0);
      expect(getGalleryItemIndex('panels-gallery-zudo-blocks-025')).toBe(158);
      expect(getGalleryItemIndex('panels-gallery-zudo-blocks-093')).toBe(226);
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
      const prev = getPreviousGalleryItem('panel-variations');
      expect(prev).toBeUndefined();
    });

    it('should return undefined for an invalid slug', () => {
      const prev = getPreviousGalleryItem('non-existent-slug');
      expect(prev).toBeUndefined();
    });

    it('should work correctly for the second item', () => {
      const prev = getPreviousGalleryItem('zb40l-construction');
      expect(prev).toBeDefined();
      expect(prev?.slug).toBe('panel-variations');
    });
  });

  describe('getNextGalleryItem', () => {
    it('should return the next item for a valid slug', () => {
      const next = getNextGalleryItem('panels-gallery-zudo-blocks-025');
      expect(next).toBeDefined();
      expect(next?.slug).toBe('panels-gallery-zudo-blocks-026');
    });

    it('should return undefined for the last item', () => {
      const next = getNextGalleryItem('panels-gallery-zudo-blocks-093');
      expect(next).toBeUndefined();
    });

    it('should return undefined for an invalid slug', () => {
      const next = getNextGalleryItem('non-existent-slug');
      expect(next).toBeUndefined();
    });

    it('should work correctly for the second-to-last item', () => {
      const next = getNextGalleryItem('panels-gallery-zudo-blocks-092');
      expect(next).toBeDefined();
      expect(next?.slug).toBe('panels-gallery-zudo-blocks-093');
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
      const items = getItemsForPreloading('panel-variations');
      expect(items).toHaveLength(3);
      expect(items[0].slug).toBe('panel-variations'); // current
      expect(items[1].slug).toBe('zb40l-construction');
      expect(items[2].slug).toBe('zb40-g-dual');
    });

    it('should handle second item correctly', () => {
      const items = getItemsForPreloading('zb40l-construction');
      expect(items).toHaveLength(4);
      expect(items[0].slug).toBe('panel-variations');
      expect(items[1].slug).toBe('zb40l-construction'); // current
      expect(items[2].slug).toBe('zb40-g-dual');
      expect(items[3].slug).toBe('zb40-g-lite');
    });

    it('should handle last item correctly', () => {
      const items = getItemsForPreloading('panels-gallery-zudo-blocks-093');
      expect(items).toHaveLength(3);
      expect(items[0].slug).toBe('panels-gallery-zudo-blocks-091');
      expect(items[1].slug).toBe('panels-gallery-zudo-blocks-092');
      expect(items[2].slug).toBe('panels-gallery-zudo-blocks-093'); // current
    });

    it('should handle second-to-last item correctly', () => {
      const items = getItemsForPreloading('panels-gallery-zudo-blocks-092');
      expect(items).toHaveLength(4);
      expect(items[0].slug).toBe('panels-gallery-zudo-blocks-090');
      expect(items[1].slug).toBe('panels-gallery-zudo-blocks-091');
      expect(items[2].slug).toBe('panels-gallery-zudo-blocks-092'); // current
      expect(items[3].slug).toBe('panels-gallery-zudo-blocks-093');
    });

    it('should return empty array for invalid slug', () => {
      const items = getItemsForPreloading('non-existent-slug');
      expect(items).toHaveLength(0);
    });
  });
});
