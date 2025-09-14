import { cases } from '../data/cases';
import { colors } from '../data/colors';
import type { Color, Series } from '../types';

interface PanelColors {
  [key: string]: string;
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

// Apply series colors to panels
export const applySeriesColors = (
  series: Series,
  caseType: string,
  material: 'acrylic' | '3dp',
): PanelColors => {
  const caseData = cases[caseType];
  const availableColors = colors[material];
  const newColors: PanelColors = {};

  const isX2Model = caseType.includes('x2');
  const is10BoxModel = caseType === '10box-lite';

  caseData.panels.forEach((panel) => {
    if (series.colors.all) {
      const color = availableColors.find((c: Color) => c.id === series.colors.all);
      if (color) newColors[panel.id] = color.value;
    } else {
      // 10BOX only supports YamiKage (all black), so skip primary/secondary logic
      if (is10BoxModel) {
        // This shouldn't happen since 10BOX only has YamiKage which has colors.all
        // But as a fallback, use carbon-black for all panels
        const color = availableColors.find((c: Color) => c.id === 'carbon-black');
        if (color) newColors[panel.id] = color.value;
        return;
      }

      let isPrimary: boolean;

      if (isX2Model) {
        // For x2 models (12 panels):
        // - All side panels (side1-4) are primary (e.g., black for Kurobeni)
        // - Other panels alternate: back1, bottom1, bottom3, front1 are primary
        if (panel.id.startsWith('side')) {
          isPrimary = true;
        } else if (
          panel.id === 'back1' ||
          panel.id === 'bottom1' ||
          panel.id === 'bottom3' ||
          panel.id === 'front1'
        ) {
          isPrimary = true;
        } else {
          isPrimary = false;
        }
      } else {
        // For regular models (8 panels): existing logic
        isPrimary =
          panel.id === 'side1' ||
          panel.id === 'side2' ||
          panel.id === 'front1' ||
          panel.id === 'bottom1' ||
          panel.id === 'back1';
      }

      const colorId = isPrimary ? series.colors.primary : series.colors.secondary;
      const color = availableColors.find((c: Color) => c.id === colorId);
      if (color) newColors[panel.id] = color.value;
    }
  });

  return newColors;
};

// Check if current panel colors match a series
export const isSeriesActive = (
  series: Series,
  panelColors: PanelColors,
  caseType: string | null,
  material: 'acrylic' | '3dp' | undefined,
): boolean => {
  if (!caseType || !material) return false;

  const caseData = cases[caseType];
  if (!caseData) return false;

  const isX2Model = caseType.includes('x2');
  const is10BoxModel = caseType === '10box-lite';

  for (const panel of caseData.panels) {
    const expectedColor = series.colors.all
      ? colors[material].find((c: Color) => c.id === series.colors.all)?.value
      : (() => {
          // 10BOX only supports YamiKage (all black)
          if (is10BoxModel) {
            return colors[material].find((c: Color) => c.id === 'carbon-black')?.value;
          }

          let isPrimary: boolean;

          if (isX2Model) {
            // For x2 models (12 panels)
            if (panel.id.startsWith('side')) {
              isPrimary = true;
            } else if (
              panel.id === 'back1' ||
              panel.id === 'bottom1' ||
              panel.id === 'bottom3' ||
              panel.id === 'front1'
            ) {
              isPrimary = true;
            } else {
              isPrimary = false;
            }
          } else {
            // For regular models (8 panels)
            isPrimary =
              panel.id === 'side1' ||
              panel.id === 'side2' ||
              panel.id === 'front1' ||
              panel.id === 'bottom1' ||
              panel.id === 'back1';
          }

          const colorId = isPrimary ? series.colors.primary : series.colors.secondary;
          return colors[material].find((c: Color) => c.id === colorId)?.value;
        })();

    if (panelColors[panel.id] !== expectedColor) {
      return false;
    }
  }

  return true;
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
