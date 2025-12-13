import type { Material, Color } from '@/types';
import { colors } from '@/data/colors';

/**
 * Centralized color service providing a single source of truth for all color operations.
 * This service consolidates color lookups scattered across multiple files.
 */
export const colorService = {
  /**
   * Get color object by ID
   * @param colorId - The color ID (e.g., 'red', 'carbon-black')
   * @param material - The material type ('acrylic' or '3dp')
   * @returns The color object or null if not found
   */
  getColorById(colorId: string, material: Material): Color | null {
    return colors[material].find((c) => c.id === colorId) ?? null;
  },

  /**
   * Get color object by hex value
   * @param value - The hex color value (e.g., '#5e0007')
   * @param material - The material type ('acrylic' or '3dp')
   * @returns The color object or null if not found
   */
  getColorByValue(value: string, material: Material): Color | null {
    return colors[material].find((c) => c.value === value) ?? null;
  },

  /**
   * Get opacity for a color by ID
   * @param colorId - The color ID
   * @param material - The material type
   * @returns The opacity value (0-1), defaults to 1 if not found
   */
  getOpacity(colorId: string, material: Material): number {
    return this.getColorById(colorId, material)?.opacity ?? 1;
  },

  /**
   * Get opacity for a color by hex value
   * Special handling for 3dp materials with semi-transparent colors.
   * @param hexValue - The hex color value or pattern identifier
   * @param material - The material type
   * @returns The opacity value (0-1), defaults to 1 if not found
   */
  getOpacityByValue(hexValue: string, material: Material): number {
    // Handle pattern values
    if (hexValue.startsWith('pattern-')) {
      return 1; // Patterns are always fully opaque
    }

    const colorList = colors[material];

    // For 3dp materials, check if this is a semi-transparent color
    // クリアレッド (#b71c1c) and クリアブルー (#0d47a1) have 0.6 opacity
    if (material === '3dp') {
      // Find colors with explicit opacity < 1 (prefer semi-transparent versions)
      const semiTransparentColor = colorList.find(
        (c) => c.value === hexValue && c.opacity !== undefined && c.opacity < 1,
      );
      if (semiTransparentColor && semiTransparentColor.opacity !== undefined) {
        return semiTransparentColor.opacity;
      }
    }

    // Default lookup
    return this.getColorByValue(hexValue, material)?.opacity ?? 1;
  },

  /**
   * Convert color IDs to hex values for rendering
   * @param panelColorIds - Map of panel IDs to color IDs
   * @param material - The material type
   * @returns Map of panel IDs to hex color values
   */
  derivePanelColors(
    panelColorIds: Record<string, string>,
    material: Material,
  ): Record<string, string> {
    const panelColors: Record<string, string> = {};
    for (const [panelId, colorId] of Object.entries(panelColorIds)) {
      const color = this.getColorById(colorId, material);
      if (color) {
        panelColors[panelId] = color.value;
      }
    }
    return panelColors;
  },

  /**
   * Create a map from color hex values to color IDs
   * Useful for reverse lookups when you have a hex value and need the ID
   * @returns Map of hex values to color IDs
   */
  createColorIdMap(): Record<string, string> {
    const map: Record<string, string> = {};
    const materials: Material[] = ['acrylic', '3dp'];

    materials.forEach((material) => {
      colors[material].forEach((color: Color) => {
        map[color.value] = color.id;
      });
    });

    return map;
  },

  /**
   * Create a map from color IDs to hex values
   * Useful for converting IDs to values for rendering
   * @returns Map of color IDs to hex values
   */
  createColorValueMap(): Record<string, string> {
    const map: Record<string, string> = {};
    const materials: Material[] = ['acrylic', '3dp'];

    materials.forEach((material) => {
      colors[material].forEach((color: Color) => {
        map[color.id] = color.value;
      });
    });

    return map;
  },
};
