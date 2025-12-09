import { cases } from '@/data/cases';
import { colors } from '@/data/colors';
import type { Color, Preset, Material } from '@/types';

interface PanelColors {
  [key: string]: string;
}

/**
 * Determines if a panel should use the primary color in a preset.
 * @param panelId - The panel ID (e.g., 'side1', 'back1')
 * @param isX2Model - Whether this is an x2 model (12 panels)
 * @returns true if the panel should use the primary color, false for secondary
 */
function isPrimaryPanel(panelId: string, isX2Model: boolean): boolean {
  if (isX2Model) {
    // For x2 models (12 panels):
    // - All side panels (side1-4) are primary
    // - Other panels alternate: back1, bottom1, bottom3, front1 are primary
    if (panelId.startsWith('side')) {
      return true;
    }
    if (
      panelId === 'back1' ||
      panelId === 'bottom1' ||
      panelId === 'bottom3' ||
      panelId === 'front1'
    ) {
      return true;
    }
    return false;
  } else {
    // For regular models (8 panels) and upgrade models (6 panels)
    return (
      panelId === 'side1' ||
      panelId === 'side2' ||
      panelId === 'front1' ||
      panelId === 'bottom1' ||
      panelId === 'back1' ||
      panelId === 'top1'
    );
  }
}

// Initialize default colors for all panels (always use first color)
export const getDefaultColors = (caseType: string): PanelColors => {
  const caseData = cases[caseType];
  if (!caseData || !caseData.material) {
    return {};
  }
  const availableColors = colors[caseData.material];
  if (!Array.isArray(availableColors) || availableColors.length === 0) {
    return {};
  }
  const defaultColor = availableColors[0];
  const defaultColors: PanelColors = {};
  caseData.panels.forEach((panel) => {
    defaultColors[panel.id] = defaultColor.value;
  });
  return defaultColors;
};

// Helper type for returning both colors and IDs
export interface PanelColorsWithIds {
  colors: PanelColors;
  colorIds: { [key: string]: string };
}

// Apply preset colors to panels (with IDs)
export const applyPresetColorsWithIds = (
  preset: Preset,
  caseType: string,
  material: Material,
): PanelColorsWithIds => {
  const caseData = cases[caseType];
  const availableColors = colors[material];
  const newColors: PanelColors = {};
  const newColorIds: { [key: string]: string } = {};

  const isX2Model = caseType.includes('x2');
  const is10BoxModel = caseType.startsWith('10box-');
  const isStandModel = caseType.startsWith('zudo-stand-');

  caseData.panels.forEach((panel) => {
    if (preset.colors.all) {
      const color = availableColors.find((c: Color) => c.id === preset.colors.all);
      if (color) {
        newColors[panel.id] = color.value;
        newColorIds[panel.id] = color.id;
      }
    } else {
      // 10BOX and Stand models only support YamiKage (all black), so skip primary/secondary logic
      if (is10BoxModel || isStandModel) {
        const color = availableColors.find((c: Color) => c.id === 'carbon-black');
        if (color) {
          newColors[panel.id] = color.value;
          newColorIds[panel.id] = color.id;
        }
        return;
      }

      const isPrimary = isPrimaryPanel(panel.id, isX2Model);
      const colorId = isPrimary ? preset.colors.primary : preset.colors.secondary;
      const color = availableColors.find((c: Color) => c.id === colorId);
      if (color) {
        newColors[panel.id] = color.value;
        newColorIds[panel.id] = color.id;
      }
    }
  });

  return { colors: newColors, colorIds: newColorIds };
};

// Apply preset colors to panels (legacy - returns only colors)
export const applyPresetColors = (
  preset: Preset,
  caseType: string,
  material: Material,
): PanelColors => {
  return applyPresetColorsWithIds(preset, caseType, material).colors;
};

// Check if current panel colors match a preset
export const isPresetActive = (
  preset: Preset,
  panelColors: PanelColors,
  caseType: string | null,
  material: Material | undefined,
  panelColorIds?: { [key: string]: string },
): boolean => {
  if (!caseType || !material) return false;

  const caseData = cases[caseType];
  if (!caseData) return false;

  const isX2Model = caseType.includes('x2');
  const is10BoxModel = caseType.startsWith('10box-');
  const isStandModel = caseType.startsWith('zudo-stand-');

  for (const panel of caseData.panels) {
    // If we have color IDs, use those for comparison (more accurate)
    if (panelColorIds && panelColorIds[panel.id]) {
      const actualColorId = panelColorIds[panel.id];
      const expectedColorId = preset.colors.all
        ? preset.colors.all
        : (() => {
            // 10BOX and Stand models only support YamiKage (all black)
            if (is10BoxModel || isStandModel) {
              return 'carbon-black';
            }

            const isPrimary = isPrimaryPanel(panel.id, isX2Model);
            return isPrimary ? preset.colors.primary : preset.colors.secondary;
          })();

      if (actualColorId !== expectedColorId) {
        return false;
      }
    } else {
      // Fallback to value comparison if no color IDs available
      const expectedColor = preset.colors.all
        ? colors[material].find((c: Color) => c.id === preset.colors.all)?.value
        : (() => {
            // 10BOX and Stand models only support YamiKage (all black)
            if (is10BoxModel || isStandModel) {
              return colors[material].find((c: Color) => c.id === 'carbon-black')?.value;
            }

            const isPrimary = isPrimaryPanel(panel.id, isX2Model);
            const colorId = isPrimary ? preset.colors.primary : preset.colors.secondary;
            return colors[material].find((c: Color) => c.id === colorId)?.value;
          })();

      if (panelColors[panel.id] !== expectedColor) {
        return false;
      }
    }
  }

  return true;
};

// Derive panel colors (hex values) from color IDs for rendering
export const derivePanelColors = (
  panelColorIds: { [key: string]: string },
  material: Material | undefined,
): PanelColors => {
  if (!material) return {};

  const panelColors: PanelColors = {};
  const availableColors = colors[material];

  if (!availableColors) return {};

  Object.entries(panelColorIds).forEach(([panelId, colorId]) => {
    const color = availableColors.find((c: Color) => c.id === colorId);
    if (color) {
      panelColors[panelId] = color.value;
    }
  });

  return panelColors;
};

// Generate background pattern SVG
export const generateBackgroundPattern = (bgColor: string, gridColor: string): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="20" height="20" patternTransform="scale(3)" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="${bgColor}"/>
          <path fill="none" stroke="${gridColor}" d="M10 0v20ZM0 10h20Z"/>
        </pattern>
      </defs>
      <rect width="800%" height="800%" fill="url(#grid)"/>
    </svg>
  `.trim();

  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
};
