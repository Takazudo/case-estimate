import { describe, it, expect, vi } from 'vitest';
import {
  getDefaultColors,
  applySeriesColors,
  isSeriesActive,
  generateBackgroundPattern,
} from './panel-colors';
import type { Series } from '@/types';

// Mock the imports before any code that uses them
vi.mock('../data/cases', () => ({
  cases: {
    'test-case-acrylic': {
      material: 'acrylic',
      panels: [
        { id: 'side1', name: 'Side 1' },
        { id: 'side2', name: 'Side 2' },
        { id: 'front1', name: 'Front 1' },
        { id: 'bottom1', name: 'Bottom 1' },
      ],
    },
    'test-case-x2-3dp': {
      material: '3dp',
      panels: [
        { id: 'side1', name: 'Side 1' },
        { id: 'side2', name: 'Side 2' },
        { id: 'side3', name: 'Side 3' },
        { id: 'side4', name: 'Side 4' },
        { id: 'front1', name: 'Front 1' },
        { id: 'back1', name: 'Back 1' },
        { id: 'bottom1', name: 'Bottom 1' },
        { id: 'bottom3', name: 'Bottom 3' },
      ],
    },
    '10box-shallow-3dp': {
      material: '3dp',
      panels: [
        { id: 'main-side1', name: 'Main Side 1' },
        { id: 'main-side2', name: 'Main Side 2' },
        { id: 'lid-top1', name: 'Lid Top 1' },
      ],
    },
  },
}));

vi.mock('../data/colors', () => ({
  colors: {
    acrylic: [
      { id: 'red', name: 'Red', value: '#ff0000' },
      { id: 'blue', name: 'Blue', value: '#0000ff' },
      { id: 'clear', name: 'Clear', value: '#ffffff' },
    ],
    '3dp': [
      { id: 'carbon-black', name: 'Carbon Black', value: '#000000' },
      { id: 'bone-white', name: 'Bone White', value: '#f5f5dc' },
      { id: 'crimson-red', name: 'Crimson Red', value: '#dc143c' },
    ],
  },
}));

describe('panel-colors', () => {
  describe('getDefaultColors', () => {
    it('should return default colors for all panels', () => {
      const defaultColors = getDefaultColors('test-case-acrylic');

      expect(defaultColors.side1).toBe('#ff0000'); // First color (red)
      expect(defaultColors.side2).toBe('#ff0000');
      expect(defaultColors.front1).toBe('#ff0000');
      expect(defaultColors.bottom1).toBe('#ff0000');
    });

    it('should return empty object for unknown case', () => {
      const defaultColors = getDefaultColors('unknown-case');
      expect(Object.keys(defaultColors)).toHaveLength(0);
    });

    it('should return empty object for case without material', () => {
      const caseWithoutMaterial = {
        material: undefined,
        panels: [{ id: 'side1', name: 'Side 1' }],
      };

      vi.doMock('../data/cases', () => ({
        cases: { 'no-material': caseWithoutMaterial },
      }));

      const defaultColors = getDefaultColors('no-material');
      expect(Object.keys(defaultColors)).toHaveLength(0);
    });
  });

  describe('applySeriesColors', () => {
    it('should apply single color for series with colors.all', () => {
      const allBlackSeries: Series = {
        id: 'all-black',
        name: 'All Black',
        colors: { all: 'carbon-black' },
      };

      const result = applySeriesColors(allBlackSeries, 'test-case-x2-3dp', '3dp');

      // All panels should have carbon-black color
      Object.values(result).forEach((color) => {
        expect(color).toBe('#000000');
      });
    });

    it('should apply primary/secondary colors for regular models', () => {
      const dualColorSeries: Series = {
        id: 'dual-color',
        name: 'Dual Color',
        colors: { primary: 'red', secondary: 'blue' }, // Use colors that exist in mock
      };

      const result = applySeriesColors(dualColorSeries, 'test-case-acrylic', 'acrylic');

      // Primary panels should have red color
      expect(result.side1).toBe('#ff0000'); // primary -> red
      expect(result.side2).toBe('#ff0000'); // primary
      expect(result.front1).toBe('#ff0000'); // primary
      expect(result.bottom1).toBe('#ff0000'); // primary
    });

    it('should handle x2 model panel assignment correctly', () => {
      const dualColorSeries: Series = {
        id: 'dual-color',
        name: 'Dual Color',
        colors: { primary: 'carbon-black', secondary: 'bone-white' },
      };

      const result = applySeriesColors(dualColorSeries, 'test-case-x2-3dp', '3dp');

      // All side panels should be primary
      expect(result.side1).toBe('#000000'); // primary (carbon-black)
      expect(result.side2).toBe('#000000'); // primary
      expect(result.side3).toBe('#000000'); // primary
      expect(result.side4).toBe('#000000'); // primary

      // Specific panels should be primary
      expect(result.back1).toBe('#000000'); // primary
      expect(result.bottom1).toBe('#000000'); // primary
      expect(result.bottom3).toBe('#000000'); // primary
      expect(result.front1).toBe('#000000'); // primary
    });

    it('should handle 10BOX model fallback to carbon-black', () => {
      const incompleteSeries: Series = {
        id: 'incomplete',
        name: 'Incomplete Series',
        colors: { primary: 'carbon-black', secondary: 'bone-white' },
      };

      const result = applySeriesColors(incompleteSeries, '10box-shallow-3dp', '3dp');

      // Should fallback to carbon-black for all panels
      Object.values(result).forEach((color) => {
        expect(color).toBe('#000000');
      });
    });
  });

  describe('isSeriesActive', () => {
    it('should return true when colors match series with colors.all', () => {
      const allBlackSeries: Series = {
        id: 'all-black',
        name: 'All Black',
        colors: { all: 'carbon-black' },
      };

      const panelColors = {
        'main-side1': '#000000',
        'main-side2': '#000000',
        'lid-top1': '#000000',
      };

      const result = isSeriesActive(allBlackSeries, panelColors, '10box-shallow-3dp', '3dp');
      expect(result).toBe(true);
    });

    it("should return false when colors don't match series", () => {
      const allBlackSeries: Series = {
        id: 'all-black',
        name: 'All Black',
        colors: { all: 'carbon-black' },
      };

      const panelColors = {
        'main-side1': '#f5f5dc', // Wrong color (bone-white instead of carbon-black)
        'main-side2': '#000000',
        'lid-top1': '#000000',
      };

      const result = isSeriesActive(allBlackSeries, panelColors, '10box-shallow-3dp', '3dp');
      expect(result).toBe(false);
    });

    it('should return false for null/undefined inputs', () => {
      const series: Series = {
        id: 'test',
        name: 'Test',
        colors: { all: 'carbon-black' },
      };

      expect(isSeriesActive(series, {}, null, '3dp')).toBe(false);
      expect(isSeriesActive(series, {}, '10box-shallow-3dp', undefined)).toBe(false);
    });

    it('should handle x2 model primary/secondary logic', () => {
      const dualColorSeries: Series = {
        id: 'dual-color',
        name: 'Dual Color',
        colors: { primary: 'carbon-black', secondary: 'bone-white' },
      };

      const matchingPanelColors = {
        side1: '#000000', // primary
        side2: '#000000', // primary
        side3: '#000000', // primary
        side4: '#000000', // primary
        front1: '#000000', // primary
        back1: '#000000', // primary
        bottom1: '#000000', // primary
        bottom3: '#000000', // primary
      };

      const result = isSeriesActive(
        dualColorSeries,
        matchingPanelColors,
        'test-case-x2-3dp',
        '3dp',
      );
      expect(result).toBe(true);
    });
  });

  describe('generateBackgroundPattern', () => {
    it('should generate valid SVG data URL', () => {
      const result = generateBackgroundPattern('#ffffff', '#000000');

      expect(result).toMatch(/^data:image\/svg\+xml,/);
      expect(result).toContain('svg');
      expect(result).toContain('pattern');
      expect(result).toContain('%23ffffff'); // URL-encoded #ffffff
      expect(result).toContain('%23000000'); // URL-encoded #000000
    });

    it('should handle different color formats', () => {
      const result1 = generateBackgroundPattern('#ff0000', '#00ff00');
      const result2 = generateBackgroundPattern('red', 'green');

      expect(result1).toMatch(/^data:image\/svg\+xml,/);
      expect(result2).toMatch(/^data:image\/svg\+xml,/);
      expect(result1).toContain('ff0000');
      expect(result1).toContain('00ff00');
      expect(result2).toContain('red');
      expect(result2).toContain('green');
    });

    it('should create grid pattern with correct dimensions', () => {
      const result = generateBackgroundPattern('#ffffff', '#000000');
      const decoded = decodeURIComponent(result.replace('data:image/svg+xml,', ''));

      expect(decoded).toContain('width="20"');
      expect(decoded).toContain('height="20"');
      expect(decoded).toContain('patternTransform="scale(3)"');
    });
  });
});
