'use client';

import { useEffect, useRef, useState } from 'react';
import { getColorOpacityByValue, getColorOpacityById } from '@/data/colors';

interface CaseVisualizerProps {
  caseType: string;
  panelColors: { [key: string]: string };
  panelColorIds?: { [key: string]: string };
  onPanelClick: (panelId: string) => void;
  selectedPanel: string | null;
  material?: string;
  onLoadingChange?: (isLoading: boolean) => void;
}

// Map SVG classes to panel IDs based on the SVG structure
// These mappings match the layout in the diagram:
// For 8-panel models (regular models)
const CLASS_TO_PANEL_8: { [key: string]: string } = {
  b: 'side1', // Panel 1: Left side (black)
  c: 'side2', // Panel 2: Right side (magenta)
  i: 'back1', // Panel 3: Top front (orange) - バック1
  e: 'back2', // Panel 4: Second top (red - behind panel 3) - バック2
  d: 'bottom1', // Panel 5: Center upper (green)
  g: 'bottom2', // Panel 6: Center lower (green)
  f: 'front1', // Panel 7: Bottom front (yellow) - フロント1
  h: 'front2', // Panel 8: Bottom back (brown) - フロント2
};

// For 12-panel models (x2 models) - based on the image provided
const CLASS_TO_PANEL_12: { [key: string]: string } = {
  a: 'side1', // A サイド1
  b: 'side2', // B サイド2
  c: 'side3', // C サイド3
  d: 'side4', // D サイド4
  e: 'back1', // E バック1
  f: 'back2', // F バック2
  g: 'bottom1', // G ボトム1
  h: 'bottom2', // H ボトム2
  i: 'bottom3', // I ボトム3
  j: 'bottom4', // J ボトム4
  k: 'front1', // K フロント1
  l: 'front2', // L フロント2
};

// For 10BOX Shallow model - maps fill colors to panel IDs
// SVG path positions (after v2 update):
// Position 1: #2e3192 (dark blue) -> Panel 8 (main-side4)
// Position 2: #00aeef (cyan) -> Panel 7 (main-side3)
// Position 3: No fill style -> Panel 2 (main-side2)
// Position 4: #00a99d (teal) -> Panel 1 (main-side1)
// Position 5: #ef4136 (red) -> Panel 3 (main-back1)
// Position 6: #00a651 (green) -> Panel 6 (main-front)
// Position 7: #fff200 (yellow) -> Panel 5 (main-bottom2)
// Position 8: #ed1c24 (darker red) -> Panel 4 (main-bottom1)
const COLOR_TO_PANEL_10BOX_SHALLOW: { [key: string]: string } = {
  '#00a99d': 'main-side1', // Panel 1: メイン: サイド1 (teal)
  // Panel 2 (main-side2) has no fill style, handled by position
  '#ef4136': 'main-back1', // Panel 3: メイン: バック1 (red - top)
  '#ed1c24': 'main-bottom1', // Panel 4: メイン: ボトム1 (darker red - center upper)
  '#fff200': 'main-bottom2', // Panel 5: メイン: ボトム2 (yellow - center middle)
  '#00a651': 'main-front', // Panel 6: メイン: フロント (green - bottom)
  '#00aeef': 'main-side3', // Panel 7: メイン: サイド3 (cyan - right main side)
  '#2e3192': 'main-side4', // Panel 8: メイン: サイド4 (dark blue - right bottom side)
  '#ec008c': 'main-stand1', // Panel 9: メイン: スタンド1 (bright magenta/pink - left stand)
  '#9e1f63': 'main-stand2', // Panel 10: メイン: スタンド2 (darker purple - right stand)
  '#662d91': 'lid-side1', // Panel 11: フタ: サイド1 (purple - left side)
  '#a97c50': 'lid-back', // Panel 12: フタ: バック (brown - top)
  '#a7a9ac': 'lid-top1', // Panel 13: フタ: トップ1 (gray - right center)
  '#939598': 'lid-top2', // Panel 14: フタ: トップ2 (light gray - left center)
  '#58595b': 'lid-front', // Panel 15: フタ: フロント (dark gray - bottom)
  '#808285': 'lid-side2', // Panel 16: フタ: サイド2 (gray - right side)
};

// For 10BOX Deep model - 16 panels (same as shallow, includes all lid panels)
// SVG path order (0-indexed):
// Path 0: #00aeef (cyan) -> main-side3
// Path 1: #00a99d (teal) -> main-side1
// Path 2: #2e3192 (dark blue) -> main-side4
// Path 3: No fill style -> main-side2
// Path 4: #ef4136 (red) -> main-back1
// Path 5: #00a651 (green) -> main-front
// Path 6: #fff200 (yellow) -> main-bottom2
// Path 7: #ed1c24 (darker red) -> main-bottom1
// Path 8: #939598 (gray) -> lid-top2
// Path 9: #a7a9ac (light gray) -> lid-top1
// Path 10: #808285 (gray) -> lid-side2
// Path 11: #662d91 (purple) -> lid-side1
// Path 12: #58595b (dark gray) -> lid-front
// Path 13: #a97c50 (brown) -> lid-back
// Path 14: #ec008c (magenta) -> main-stand1
// Path 15: #9e1f63 (dark purple) -> main-stand2
const COLOR_TO_PANEL_10BOX_DEEP: { [key: string]: string } = {
  '#00aeef': 'main-side3', // Path 0: メイン: サイド3 (cyan)
  '#00a99d': 'main-side1', // Path 1: メイン: サイド1 (teal)
  '#2e3192': 'main-side4', // Path 2: メイン: サイド4 (dark blue)
  // Path 3 (main-side2) has no fill style, handled by position
  '#ef4136': 'main-back1', // Path 4: メイン: バック1 (red)
  '#00a651': 'main-front', // Path 5: メイン: フロント (green)
  '#fff200': 'main-bottom2', // Path 6: メイン: ボトム2 (yellow)
  '#ed1c24': 'main-bottom1', // Path 7: メイン: ボトム1 (darker red)
  '#939598': 'lid-top2', // Path 8: フタ: トップ2 (gray)
  '#a7a9ac': 'lid-top1', // Path 9: フタ: トップ1 (light gray)
  '#808285': 'lid-side2', // Path 10: フタ: サイド2 (gray)
  '#662d91': 'lid-side1', // Path 11: フタ: サイド1 (purple)
  '#58595b': 'lid-front', // Path 12: フタ: フロント (dark gray)
  '#a97c50': 'lid-back', // Path 13: フタ: バック (brown)
  '#ec008c': 'main-stand1', // Path 14: メイン: スタンド1 (magenta)
  '#9e1f63': 'main-stand2', // Path 15: メイン: スタンド2 (dark purple)
};

// For zudo-block-60-open Type A and B models - 2 panels
const COLOR_TO_PANEL_OPEN_2: { [key: string]: string } = {
  '#9e005d': 'side1', // Left panel (purple/magenta)
  '#00a99d': 'side2', // Right panel (teal/cyan)
};

// For zudo-block-60-open Upgrade model - 6 panels
const COLOR_TO_PANEL_OPEN_UPGRADE: { [key: string]: string } = {
  '#fbb040': 'back1', // Position 1: バック1 (orange)
  '#be1e2d': 'back2', // Position 2: バック2 (red)
  '#ff7bac': 'bottom1', // Position 3: ボトム1 (pink)
  '#ed1e79': 'bottom2', // Position 4: ボトム2 (magenta/red)
  '#f9ed32': 'top1', // Position 5: トップ1 (yellow)
  '#c69c6d': 'top2', // Position 6: トップ2 (tan/beige)
};

// For zudo-stand models - 4 panels (all variants use same mapping)
const COLOR_TO_PANEL_ZUDO_STAND: { [key: string]: string } = {
  '#fbb040': 'angle1', // Left angle (orange)
  '#ed1e79': 'angle2', // Right angle (pink)
  '#be1e2d': 'support1', // Top support (red)
  '#ff7bac': 'support2', // Bottom support (light pink)
};

// For 5box-shallow model - 11 panels
// Maps SVG path colors to panel IDs based on visual positions in user's diagram
const COLOR_TO_PANEL_5BOX_SHALLOW: { [key: string]: string } = {
  '#00a99d': 'main-side1', // LEFT panel (visual pos 1) -> Panel 1: メイン: サイド1
  '#ef4136': 'main-side2', // TOP panel (visual pos 2) -> Panel 2: メイン: サイド2
  '#ed1c24': 'main-back1', // CENTER main (visual pos 3) -> Panel 3: メイン: バック1
  '#00a651': 'main-bottom1', // BOTTOM panel (visual pos 4) -> Panel 4: メイン: ボトム1
  '#00aeef': 'main-bottom2', // RIGHT panel (visual pos 5) -> Panel 5: メイン: ボトム2
  '#939598': 'main-front', // Lid right section (visual pos 6) -> Panel 6: メイン: フロント
  '#a7a9ac': 'lid-side1', // Lid left section (visual pos 7) -> Panel 7: フタ: サイド1
  '#58595b': 'lid-side2', // Lid bottom (visual pos 8) -> Panel 8: フタ: サイド2
  '#a97c50': 'lid-back1', // Lid top (visual pos 9) -> Panel 9: フタ: バック1
  '#808285': 'lid-back2', // Lid right edge (visual pos 10) -> Panel 10: フタ: バック2
  '#662d91': 'lid-front', // Lid left edge (visual pos 11) -> Panel 11: フタ: フロント
};

// Default black color for all panels
const DEFAULT_PANEL_COLOR = '#1f2937';

// Timing constant for SVG rendering delay
const SVG_RENDER_DELAY_MS = 50;

const CaseVisualizer = ({
  caseType,
  panelColors,
  panelColorIds,
  onPanelClick,
  selectedPanel,
  material,
  onLoadingChange,
}: CaseVisualizerProps) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [svgLoaded, setSvgLoaded] = useState(false);

  // Determine which class mapping to use based on model type
  const isX2Model = caseType.includes('x2');
  const is10BoxModel = caseType.startsWith('10box-');
  const is5BoxModel = caseType.startsWith('5box-');
  const isOpenModel = caseType.includes('open');
  const isStandModel = caseType.startsWith('zudo-stand-');
  const CLASS_TO_PANEL = isX2Model ? CLASS_TO_PANEL_12 : CLASS_TO_PANEL_8;

  // Add pattern definitions to SVG
  const addPatternsToSvg = (svg: SVGElement) => {
    // Check if patterns already exist
    if (svg.querySelector('#red-green-stripe-pattern')) return;

    // Create defs element if it doesn't exist
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.insertBefore(defs, svg.firstChild);
    }

    // Create red/green diagonal stripe pattern
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'red-green-stripe-pattern');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', '20');
    pattern.setAttribute('height', '20');
    pattern.setAttribute('patternTransform', 'rotate(45)');

    // Reddish-brown background (matching reference image)
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '20');
    bg.setAttribute('height', '20');
    bg.setAttribute('fill', '#a4534a');
    pattern.appendChild(bg);

    // Light green stripes (matching reference image)
    const stripe1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    stripe1.setAttribute('x', '0');
    stripe1.setAttribute('y', '0');
    stripe1.setAttribute('width', '10');
    stripe1.setAttribute('height', '20');
    stripe1.setAttribute('fill', '#7bc97d');
    pattern.appendChild(stripe1);

    defs.appendChild(pattern);
  };

  // Load and inject the SVG
  useEffect(() => {
    setSvgLoaded(false);
    onLoadingChange?.(true);

    const loadSVG = async () => {
      try {
        // Dynamically select SVG path based on caseType
        const svgPath = `/svg/${caseType}.svg`;

        const response = await fetch(svgPath);
        const svgText = await response.text();

        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = svgText;

          // Ensure the SVG scales properly and centers
          const svg = svgContainerRef.current?.querySelector('svg');
          if (svg) {
            // Remove width/height attributes to let viewBox handle sizing
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            // Set proper styling for centering and scaling
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.style.maxWidth = '100%';
            svg.style.maxHeight = '100%';
            svg.style.display = 'block';
            svg.style.margin = 'auto';

            // For 10BOX model, 5BOX model, Open models, and Stand models, immediately set all panels to black to prevent color flash
            if (is10BoxModel || is5BoxModel || isOpenModel || isStandModel) {
              // Select the appropriate color mapping based on model type
              let colorToPanelMap: { [key: string]: string };
              if (caseType === '10box-shallow-3dp') {
                colorToPanelMap = COLOR_TO_PANEL_10BOX_SHALLOW;
              } else if (caseType === '10box-deep-3dp') {
                colorToPanelMap = COLOR_TO_PANEL_10BOX_DEEP;
              } else if (caseType === '5box-shallow-3dp') {
                colorToPanelMap = COLOR_TO_PANEL_5BOX_SHALLOW;
              } else if (caseType.includes('upgrade')) {
                colorToPanelMap = COLOR_TO_PANEL_OPEN_UPGRADE;
              } else if (isStandModel) {
                colorToPanelMap = COLOR_TO_PANEL_ZUDO_STAND;
              } else {
                colorToPanelMap = COLOR_TO_PANEL_OPEN_2;
              }

              // Get all paths (including the one without fill style for Panel 2)
              const allPaths = svg.querySelectorAll('path');
              // Include both paths with fill styles AND the path at position 3 (Panel 2 with no fill)
              const paths = Array.from(allPaths);

              paths.forEach((path: Element, index: number) => {
                const pathElement = path as HTMLElement;
                const styleAttr = pathElement.getAttribute('style') || '';
                const fillMatch = styleAttr.match(/fill:\s*([^;]+)/i);

                let panelId: string | undefined;

                // Check if this is Panel 2 (main-side2) - has no fill style
                // Position varies between models: shallow (index 2) vs deep (index 3)
                // This logic only applies to 10BOX models, not Open models
                const isSide2NoFill =
                  is10BoxModel &&
                  !fillMatch &&
                  ((caseType === '10box-shallow-3dp' && index === 2) ||
                    (caseType === '10box-deep-3dp' && index === 3));

                if (isSide2NoFill) {
                  panelId = 'main-side2'; // Panel 2: メイン: サイド2
                } else if (fillMatch) {
                  // Extract the color and normalize to lowercase for consistent matching
                  const originalColor = fillMatch[1].trim().toLowerCase();
                  panelId = colorToPanelMap[originalColor];
                }

                if (panelId) {
                  // Store the panel ID for later use
                  pathElement.setAttribute('data-panel-id', panelId);
                  // Immediately set to black to prevent color flash
                  pathElement.style.fill = DEFAULT_PANEL_COLOR;
                  pathElement.style.setProperty('fill', DEFAULT_PANEL_COLOR, 'important');

                  // For Panel 2, also ensure it has proper stroke for visibility
                  if (panelId === 'main-side2') {
                    pathElement.style.stroke = '#000000';
                    pathElement.style.strokeWidth = '1';
                    pathElement.setAttribute('vector-effect', 'non-scaling-stroke');
                  }
                } else if (fillMatch) {
                  // This path has a fill color but no mapped panel ID
                  // This shouldn't happen if our mappings are complete, but leave path in DOM
                  const modelType = is10BoxModel
                    ? '10BOX'
                    : is5BoxModel
                      ? '5BOX'
                      : isOpenModel
                        ? 'Open'
                        : isStandModel
                          ? 'Stand'
                          : 'unknown';
                  const unmappedColor = fillMatch[1].trim().toLowerCase();
                  console.warn(
                    `Unmapped color in ${modelType} model: ${unmappedColor} at index ${index}`,
                  );
                }
              });
            } else {
              // Remove or override the style element that contains default colors
              const styleElement = svg.querySelector('style');
              if (styleElement) {
                // Override the CSS rules to use black as default
                const classes = isX2Model
                  ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']
                  : ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
                const newStyles = classes
                  .map((cls) => `.${cls}{fill:${DEFAULT_PANEL_COLOR};}`)
                  .join('');
                styleElement.textContent = newStyles;
              }
            }
          }

          // Add pattern definitions
          if (svg) {
            addPatternsToSvg(svg);
          }

          setSvgLoaded(true);
          onLoadingChange?.(false);
        }
      } catch (error) {
        console.error('Failed to load SVG:', error);
        onLoadingChange?.(false);
      }
    };

    loadSVG();
  }, [caseType, isX2Model, is10BoxModel, is5BoxModel, isOpenModel, isStandModel, onLoadingChange]);

  // Handle clicks and color updates
  useEffect(() => {
    if (!svgLoaded || !svgContainerRef.current) return;

    // Small delay to ensure SVG is fully rendered
    const timeoutId = setTimeout(() => {
      const svg = svgContainerRef.current?.querySelector('svg');
      if (!svg) return;

      if (is10BoxModel || is5BoxModel || isOpenModel || isStandModel) {
        // Handle 10BOX, 5BOX, Open, and Stand models which use inline styles
        // Select all paths with data-panel-id (which were set during SVG load)
        const paths = svg.querySelectorAll('path[data-panel-id]');

        paths.forEach((path: Element) => {
          const pathElement = path as HTMLElement;

          // Get the panel ID that was set during SVG load
          const panelId = pathElement.getAttribute('data-panel-id');

          if (panelId) {
            // Set cursor style
            pathElement.style.cursor = 'pointer';

            // Remove old event listener if it exists
            pathElement.onclick = null;

            // Add click handler
            pathElement.onclick = (e: MouseEvent) => {
              e.stopPropagation();
              onPanelClick(panelId);
            };

            // Update color if specified, otherwise use default black
            const color = panelColors[panelId] || DEFAULT_PANEL_COLOR;

            // Handle pattern fills
            const isPatternFill = color === 'pattern-red-green-stripe';

            // Handle transparent acrylic colors specially
            const isTransparentAcrylic =
              material === 'acrylic' && (color === '#f8f9fa' || color === '#4a9b9b'); // clear or frost-clear values

            if (isPatternFill) {
              // Use pattern fill for red-green silk
              pathElement.style.fill = 'url(#red-green-stripe-pattern)';
              pathElement.style.setProperty('fill', 'url(#red-green-stripe-pattern)', 'important');
              pathElement.style.setProperty('fill-opacity', '1', 'important');
            } else if (isTransparentAcrylic) {
              // For transparent acrylic, use transparent fill (not "none" to keep it clickable)
              pathElement.style.fill = 'transparent';
              pathElement.style.setProperty('fill', 'transparent', 'important');
              pathElement.style.setProperty('fill-opacity', '1', 'important');
            } else {
              // Use both setAttribute and style to ensure the color is applied
              pathElement.style.fill = color;
              pathElement.style.setProperty('fill', color, 'important');

              // Get color-specific opacity from the color definition
              let opacity: number;
              if (material === 'acrylic' || material === '3dp') {
                // Use color ID if available, otherwise fall back to hex value
                const colorId = panelColorIds?.[panelId];
                if (colorId) {
                  opacity = getColorOpacityById(colorId, material);
                } else {
                  opacity = getColorOpacityByValue(color, material);
                }
              } else {
                // Default opacity for acrylic if material is undefined
                opacity = 0.8;
              }

              pathElement.style.setProperty('fill-opacity', opacity.toString(), 'important');
            }

            // Set stroke color and width based on transparent acrylic type
            let strokeColor = '#000000'; // default black
            let strokeWidth = '1'; // default 1px for non-transparent

            if (isTransparentAcrylic) {
              strokeWidth = '4'; // 4px for transparent acrylics
              if (color === '#4a9b9b') {
                strokeColor = '#117269'; // ガラスシアン - glass-like edge
              }
              // クリア stays #000000 (default)
            }

            pathElement.style.stroke = strokeColor;
            pathElement.style.strokeWidth = strokeWidth;
            pathElement.setAttribute('vector-effect', 'non-scaling-stroke');

            // Add hover effect with better transitions
            pathElement.style.transition = 'all 0.2s ease-out';

            // Add selected state visual feedback
            if (selectedPanel === panelId) {
              pathElement.style.filter = 'drop-shadow(0 0 12px oklch(54.6% 0.245 262.881 / 0.9))';
              // Use thicker stroke for selected (4px for normal, 8px for transparent)
              const selectedStrokeWidth = isTransparentAcrylic ? '8' : '4';
              pathElement.style.strokeWidth = selectedStrokeWidth;
              pathElement.style.stroke = 'oklch(54.6% 0.245 262.881 / 0.9)';
            } else {
              pathElement.style.filter = 'none';
              // Keep the border with appropriate color and width
              pathElement.style.strokeWidth = strokeWidth;
              pathElement.style.stroke = strokeColor;
            }

            // Hover effects - more visible for acrylic panels
            pathElement.onmouseenter = () => {
              if (selectedPanel !== panelId) {
                // Add drop shadow and border for better visibility
                pathElement.style.filter = 'drop-shadow(0 0 4px oklch(54.6% 0.245 262.881 / 0.6))';
                // Use thicker stroke for hover (2px for normal, 6px for transparent)
                const hoverStrokeWidth = isTransparentAcrylic ? '6' : '2';
                pathElement.style.strokeWidth = hoverStrokeWidth;
                pathElement.style.stroke = 'oklch(54.6% 0.245 262.881 / 0.6)';

                // Subtle brightness adjustment instead of opacity
                if (material === 'acrylic') {
                  pathElement.style.filter =
                    'drop-shadow(0 0 4px oklch(54.6% 0.245 262.881 / 0.6)) brightness(1.1)';
                }
              }
            };

            pathElement.onmouseleave = () => {
              if (selectedPanel !== panelId) {
                // Remove hover effects but keep border with appropriate color and width
                pathElement.style.filter = 'none';
                pathElement.style.strokeWidth = strokeWidth;
                pathElement.style.stroke = strokeColor;
              }

              // Restore color-specific opacity
              let baseOpacity: number;
              if (material === 'acrylic' || material === '3dp') {
                const colorId = panelColorIds?.[panelId];
                if (colorId) {
                  baseOpacity = getColorOpacityById(colorId, material);
                } else {
                  const color = panelColors[panelId] || DEFAULT_PANEL_COLOR;
                  baseOpacity = getColorOpacityByValue(color, material);
                }
              } else {
                baseOpacity = 0.8; // Default for acrylic if material is undefined
              }
              pathElement.style.setProperty('fill-opacity', baseOpacity.toString(), 'important');
            };
          }
        });
      } else {
        // Handle regular models with class-based mappings
        // Add click handlers to all paths
        Object.entries(CLASS_TO_PANEL).forEach(([className, panelId]) => {
          const paths = svg.querySelectorAll(`.${className}`);

          paths.forEach((path: Element) => {
            const pathElement = path as HTMLElement;
            // Set cursor style
            pathElement.style.cursor = 'pointer';

            // Remove old event listener if it exists
            pathElement.onclick = null;

            // Add click handler
            pathElement.onclick = (e: MouseEvent) => {
              e.stopPropagation();
              onPanelClick(panelId);
            };

            // Update color if specified, otherwise use default black
            const color = panelColors[panelId] || DEFAULT_PANEL_COLOR;

            // Handle pattern fills
            const isPatternFill = color === 'pattern-red-green-stripe';

            // Handle transparent acrylic colors specially
            const isTransparentAcrylic =
              material === 'acrylic' && (color === '#f8f9fa' || color === '#4a9b9b'); // clear or frost-clear values

            if (isPatternFill) {
              // Use pattern fill for red-green silk
              pathElement.style.fill = 'url(#red-green-stripe-pattern)';
              pathElement.setAttribute('fill', 'url(#red-green-stripe-pattern)');
              pathElement.style.setProperty('fill', 'url(#red-green-stripe-pattern)', 'important');
              pathElement.style.setProperty('fill-opacity', '1', 'important');
            } else if (isTransparentAcrylic) {
              // For transparent acrylic, use transparent fill (not "none" to keep it clickable)
              pathElement.style.fill = 'transparent';
              pathElement.setAttribute('fill', 'transparent');
              pathElement.style.setProperty('fill', 'transparent', 'important');
              pathElement.style.setProperty('fill-opacity', '1', 'important');
            } else {
              // Use both setAttribute and style to ensure the color is applied
              pathElement.setAttribute('fill', color);
              pathElement.style.fill = color;
              pathElement.style.setProperty('fill', color, 'important');

              // Get color-specific opacity from the color definition
              let opacity: number;
              if (material === 'acrylic' || material === '3dp') {
                // Use color ID if available, otherwise fall back to hex value
                const colorId = panelColorIds?.[panelId];
                if (colorId) {
                  opacity = getColorOpacityById(colorId, material);
                } else {
                  opacity = getColorOpacityByValue(color, material);
                }
              } else {
                // Default opacity for acrylic if material is undefined
                opacity = 0.8;
              }

              pathElement.style.setProperty('fill-opacity', opacity.toString(), 'important');
            }

            // Set stroke color and width based on transparent acrylic type
            let strokeColor = '#000000'; // default black
            let strokeWidth = '1'; // default 1px for non-transparent

            if (isTransparentAcrylic) {
              strokeWidth = '4'; // 4px for transparent acrylics
              if (color === '#4a9b9b') {
                strokeColor = '#117269'; // ガラスシアン - glass-like edge
              }
              // クリア stays #000000 (default)
            }

            pathElement.style.stroke = strokeColor;
            pathElement.style.strokeWidth = strokeWidth;
            pathElement.setAttribute('vector-effect', 'non-scaling-stroke');

            // Add hover effect with better transitions
            pathElement.style.transition = 'all 0.2s ease-out';
            pathElement.style.cursor = 'pointer';

            // Add selected state visual feedback
            if (selectedPanel === panelId) {
              pathElement.style.filter = 'drop-shadow(0 0 12px oklch(54.6% 0.245 262.881 / 0.9))';
              // Use thicker stroke for selected (4px for normal, 8px for transparent)
              const selectedStrokeWidth = isTransparentAcrylic ? '8' : '4';
              pathElement.style.strokeWidth = selectedStrokeWidth;
              pathElement.style.stroke = 'oklch(54.6% 0.245 262.881 / 0.9)';
            } else {
              pathElement.style.filter = 'none';
              // Keep the border with appropriate color and width
              pathElement.style.strokeWidth = strokeWidth;
              pathElement.style.stroke = strokeColor;
            }

            // Hover effects - more visible for acrylic panels
            pathElement.onmouseenter = () => {
              if (selectedPanel !== panelId) {
                // Add drop shadow and border for better visibility
                pathElement.style.filter = 'drop-shadow(0 0 4px oklch(54.6% 0.245 262.881 / 0.6))';
                // Use thicker stroke for hover (2px for normal, 6px for transparent)
                const hoverStrokeWidth = isTransparentAcrylic ? '6' : '2';
                pathElement.style.strokeWidth = hoverStrokeWidth;
                pathElement.style.stroke = 'oklch(54.6% 0.245 262.881 / 0.6)';

                // Subtle brightness adjustment instead of opacity
                if (material === 'acrylic') {
                  pathElement.style.filter =
                    'drop-shadow(0 0 4px oklch(54.6% 0.245 262.881 / 0.6)) brightness(1.1)';
                }
              }
            };

            pathElement.onmouseleave = () => {
              if (selectedPanel !== panelId) {
                // Remove hover effects but keep border with appropriate color and width
                pathElement.style.filter = 'none';
                pathElement.style.strokeWidth = strokeWidth;
                pathElement.style.stroke = strokeColor;
              }

              // Restore color-specific opacity
              let baseOpacity: number;
              if (material === 'acrylic' || material === '3dp') {
                const colorId = panelColorIds?.[panelId];
                if (colorId) {
                  baseOpacity = getColorOpacityById(colorId, material);
                } else {
                  const color = panelColors[panelId] || DEFAULT_PANEL_COLOR;
                  baseOpacity = getColorOpacityByValue(color, material);
                }
              } else {
                baseOpacity = 0.8; // Default for acrylic if material is undefined
              }
              pathElement.style.setProperty('fill-opacity', baseOpacity.toString(), 'important');
            };
          });
        });
      }
    }, SVG_RENDER_DELAY_MS); // Delay to ensure DOM is ready

    return () => clearTimeout(timeoutId);
  }, [
    svgLoaded,
    panelColors,
    panelColorIds,
    selectedPanel,
    onPanelClick,
    material,
    CLASS_TO_PANEL,
    is10BoxModel,
    is5BoxModel,
    isOpenModel,
    isStandModel,
  ]);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div ref={svgContainerRef} className="w-full h-full flex items-center justify-center" />
    </div>
  );
};

export default CaseVisualizer;
