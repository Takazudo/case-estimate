import { describe, it, expect } from 'vitest';
import { colorService } from './color-service';
import { colors } from '@/data/colors';
import type { Material } from '@/types';

describe('color-service', () => {
  describe('getColorById', () => {
    it('should return color object for valid acrylic color ID', () => {
      const color = colorService.getColorById('red', 'acrylic');
      expect(color).toBeDefined();
      expect(color?.id).toBe('red');
      expect(color?.value).toBe('#5e0007');
      expect(color?.material).toBe('Red');
    });

    it('should return color object for valid 3dp color ID', () => {
      const color = colorService.getColorById('carbon-black', '3dp');
      expect(color).toBeDefined();
      expect(color?.id).toBe('carbon-black');
      expect(color?.value).toBe('#212121');
      expect(color?.material).toBe('PLA-CF');
    });

    it('should return null for invalid color ID', () => {
      const color = colorService.getColorById('invalid-color', 'acrylic');
      expect(color).toBeNull();
    });

    it('should return null for color ID from wrong material', () => {
      const color = colorService.getColorById('red', '3dp');
      expect(color).toBeNull();
    });
  });

  describe('getColorByValue', () => {
    it('should return color object for valid acrylic hex value', () => {
      const color = colorService.getColorByValue('#5e0007', 'acrylic');
      expect(color).toBeDefined();
      expect(color?.id).toBe('red');
      expect(color?.value).toBe('#5e0007');
    });

    it('should return color object for valid 3dp hex value', () => {
      const color = colorService.getColorByValue('#212121', '3dp');
      expect(color).toBeDefined();
      expect(color?.id).toBe('carbon-black');
      expect(color?.value).toBe('#212121');
    });

    it('should return color object for pattern value', () => {
      const color = colorService.getColorByValue('pattern-red-green-stripe', '3dp');
      expect(color).toBeDefined();
      expect(color?.id).toBe('red-green-silk');
    });

    it('should return null for invalid hex value', () => {
      const color = colorService.getColorByValue('#invalid', 'acrylic');
      expect(color).toBeNull();
    });

    it('should return null for hex value from wrong material', () => {
      const color = colorService.getColorByValue('#5e0007', '3dp');
      expect(color).toBeNull();
    });
  });

  describe('getOpacity', () => {
    it('should return correct opacity for acrylic color', () => {
      const opacity = colorService.getOpacity('red', 'acrylic');
      expect(opacity).toBe(0.6);
    });

    it('should return correct opacity for 3dp color', () => {
      const opacity = colorService.getOpacity('carbon-black', '3dp');
      expect(opacity).toBe(1);
    });

    it('should return correct opacity for semi-transparent 3dp color', () => {
      const opacity = colorService.getOpacity('clear-blue', '3dp');
      expect(opacity).toBe(0.6);
    });

    it('should return 1 (default) for invalid color ID', () => {
      const opacity = colorService.getOpacity('invalid-color', 'acrylic');
      expect(opacity).toBe(1);
    });
  });

  describe('getOpacityByValue', () => {
    it('should return correct opacity for acrylic hex value', () => {
      const opacity = colorService.getOpacityByValue('#5e0007', 'acrylic');
      expect(opacity).toBe(0.6);
    });

    it('should return 1 for pattern values', () => {
      const opacity = colorService.getOpacityByValue('pattern-red-green-stripe', '3dp');
      expect(opacity).toBe(1);
    });

    it('should return correct opacity for semi-transparent 3dp color by hex', () => {
      // Clear Blue (#0d47a1) should have 0.6 opacity
      const opacity = colorService.getOpacityByValue('#0d47a1', '3dp');
      expect(opacity).toBe(0.6);
    });

    it('should prefer semi-transparent version for 3dp colors with same hex', () => {
      // #b71c1c exists as both clear-red (0.6 opacity) and crimson-red (1.0 opacity)
      // Should prefer semi-transparent version
      const opacity = colorService.getOpacityByValue('#b71c1c', '3dp');
      expect(opacity).toBe(0.6);
    });

    it('should return 1 (default) for invalid hex value', () => {
      const opacity = colorService.getOpacityByValue('#invalid', 'acrylic');
      expect(opacity).toBe(1);
    });
  });

  describe('derivePanelColors', () => {
    it('should convert color IDs to hex values for acrylic', () => {
      const panelColorIds = {
        side1: 'red',
        side2: 'orange',
        front1: 'yellow',
      };
      const result = colorService.derivePanelColors(panelColorIds, 'acrylic');
      expect(result).toEqual({
        side1: '#5e0007',
        side2: '#d14600',
        front1: '#dda300',
      });
    });

    it('should convert color IDs to hex values for 3dp', () => {
      const panelColorIds = {
        side1: 'carbon-black',
        side2: 'bone-white',
      };
      const result = colorService.derivePanelColors(panelColorIds, '3dp');
      expect(result).toEqual({
        side1: '#212121',
        side2: '#a59d88',
      });
    });

    it('should handle pattern colors', () => {
      const panelColorIds = {
        side1: 'red-green-silk',
      };
      const result = colorService.derivePanelColors(panelColorIds, '3dp');
      expect(result).toEqual({
        side1: 'pattern-red-green-stripe',
      });
    });

    it('should skip invalid color IDs', () => {
      const panelColorIds = {
        side1: 'red',
        side2: 'invalid-color',
        front1: 'yellow',
      };
      const result = colorService.derivePanelColors(panelColorIds, 'acrylic');
      expect(result).toEqual({
        side1: '#5e0007',
        front1: '#dda300',
      });
    });

    it('should return empty object for empty input', () => {
      const result = colorService.derivePanelColors({}, 'acrylic');
      expect(result).toEqual({});
    });
  });

  describe('createColorIdMap', () => {
    it('should create mapping from hex values to color IDs', () => {
      const map = colorService.createColorIdMap();
      expect(map).toBeDefined();
      expect(typeof map).toBe('object');

      // Test some known mappings
      expect(map['#5e0007']).toBe('red');
      expect(map['#212121']).toBe('carbon-black');
      expect(map['pattern-red-green-stripe']).toBe('red-green-silk');
    });

    it('should include colors from both materials', () => {
      const map = colorService.createColorIdMap();
      const acrylicColors = colors.acrylic.map((c) => c.value);
      const threeDPColors = colors['3dp'].map((c) => c.value);

      acrylicColors.forEach((value) => {
        expect(map[value]).toBeDefined();
      });

      threeDPColors.forEach((value) => {
        expect(map[value]).toBeDefined();
      });
    });
  });

  describe('createColorValueMap', () => {
    it('should create mapping from color IDs to hex values', () => {
      const map = colorService.createColorValueMap();
      expect(map).toBeDefined();
      expect(typeof map).toBe('object');

      // Test some known mappings
      expect(map['red']).toBe('#5e0007');
      expect(map['carbon-black']).toBe('#212121');
      expect(map['red-green-silk']).toBe('pattern-red-green-stripe');
    });

    it('should include colors from both materials', () => {
      const map = colorService.createColorValueMap();
      const acrylicColors = colors.acrylic.map((c) => c.id);
      const threeDPColors = colors['3dp'].map((c) => c.id);

      acrylicColors.forEach((id) => {
        expect(map[id]).toBeDefined();
      });

      threeDPColors.forEach((id) => {
        expect(map[id]).toBeDefined();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle all actual color IDs from data', () => {
      const materials: Material[] = ['acrylic', '3dp'];

      materials.forEach((material) => {
        colors[material].forEach((color) => {
          const result = colorService.getColorById(color.id, material);
          expect(result).toBeDefined();
          expect(result?.id).toBe(color.id);
          expect(result?.value).toBe(color.value);
        });
      });
    });

    it('should handle all actual hex values from data', () => {
      const materials: Material[] = ['acrylic', '3dp'];

      materials.forEach((material) => {
        colors[material].forEach((color) => {
          const result = colorService.getColorByValue(color.value, material);
          expect(result).toBeDefined();
          // Note: When multiple colors share the same hex value (e.g., clear-red and crimson-red),
          // getColorByValue returns the first match. For 3dp semi-transparent colors, it prefers
          // the semi-transparent version (clear-red over crimson-red)
          expect(result?.value).toBe(color.value);
        });
      });
    });
  });
});
