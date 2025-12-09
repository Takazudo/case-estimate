'use client';

import { useEffect, useRef, useState } from 'react';
import { getColorOpacityByValue, getColorOpacityById } from '@/data/colors';
import {
  CLASS_TO_PANEL_8,
  CLASS_TO_PANEL_12,
  COLOR_TO_PANEL_10BOX_SHALLOW,
  COLOR_TO_PANEL_10BOX_DEEP,
  COLOR_TO_PANEL_OPEN_2,
  COLOR_TO_PANEL_OPEN_UPGRADE,
  COLOR_TO_PANEL_ZUDO_STAND,
  COLOR_TO_PANEL_5BOX_SHALLOW,
} from '@/data/panel-mappings';

interface CaseVisualizerProps {
  caseType: string;
  panelColors: { [key: string]: string };
  panelColorIds?: { [key: string]: string };
  onPanelClick: (panelId: string) => void;
  selectedPanel: string | null;
  material?: string;
  onLoadingChange?: (isLoading: boolean) => void;
}

// Default black color for all panels
const DEFAULT_PANEL_COLOR = '#1f2937';

// Timing constant for SVG rendering delay
const SVG_RENDER_DELAY_MS = 50;

// Stroke width constants
const STROKE_WIDTH = {
  default: '1',
  transparent: '4',
  hoverNormal: '2',
  hoverTransparent: '6',
  selectedNormal: '4',
  selectedTransparent: '8',
} as const;

// Selection and hover colors (oklch: lightness%, chroma, hue, alpha)
const SELECTION_COLOR_SELECTED = 'oklch(54.6% 0.245 262.881 / 0.9)';
const SELECTION_COLOR_HOVER = 'oklch(54.6% 0.245 262.881 / 0.6)';
const DROP_SHADOW_SELECTED = `drop-shadow(0 0 12px ${SELECTION_COLOR_SELECTED})`;
const DROP_SHADOW_HOVER = `drop-shadow(0 0 4px ${SELECTION_COLOR_HOVER})`;
const BRIGHTNESS_FILTER_HOVER = `${DROP_SHADOW_HOVER} brightness(1.1)`;

// Transparent acrylic color constants
const TRANSPARENT_ACRYLIC_COLORS = {
  clear: '#f8f9fa',
  frostClear: '#4a9b9b',
  frostClearEdge: '#117269', // ガラスシアン - glass-like edge
} as const;

// Stroke info returned by applyPanelStyles
interface StrokeInfo {
  strokeColor: string;
  strokeWidth: string;
  isTransparentAcrylic: boolean;
}

// Validate color value to prevent CSS injection
// Only allow hex colors (#RRGGBB or #RGB) or the special pattern fill
function isValidColor(color: string): boolean {
  if (color === 'pattern-red-green-stripe') return true;
  // Validate hex color format: #RGB or #RRGGBB
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
}

// Helper function to calculate base opacity for a panel
function getBaseOpacity(
  panelId: string,
  material: string | undefined,
  panelColors: { [key: string]: string },
  panelColorIds?: { [key: string]: string },
): number {
  if (material === 'acrylic' || material === '3dp') {
    const colorId = panelColorIds?.[panelId];
    if (colorId) {
      return getColorOpacityById(colorId, material);
    }
    const color = panelColors[panelId] || DEFAULT_PANEL_COLOR;
    return getColorOpacityByValue(color, material);
  }
  return 0.8; // Default opacity for acrylic if material is undefined
}

// Helper function to apply panel styles
function applyPanelStyles(
  pathElement: SVGPathElement,
  color: string,
  material: string | undefined,
  panelColorIds: { [key: string]: string } | undefined,
  panelId: string,
  panelColors: { [key: string]: string },
  useSetAttribute: boolean = false,
): StrokeInfo {
  // Handle pattern fills
  const isPatternFill = color === 'pattern-red-green-stripe';

  // Handle transparent acrylic colors specially
  const isTransparentAcrylic =
    material === 'acrylic' &&
    (color === TRANSPARENT_ACRYLIC_COLORS.clear || color === TRANSPARENT_ACRYLIC_COLORS.frostClear);

  if (isPatternFill) {
    // Use pattern fill for red-green silk
    if (useSetAttribute) {
      pathElement.setAttribute('fill', 'url(#red-green-stripe-pattern)');
    }
    pathElement.style.setProperty('fill', 'url(#red-green-stripe-pattern)', 'important');
    pathElement.style.setProperty('fill-opacity', '1', 'important');
  } else if (isTransparentAcrylic) {
    // For transparent acrylic, use transparent fill (not "none" to keep it clickable)
    if (useSetAttribute) {
      pathElement.setAttribute('fill', 'transparent');
    }
    pathElement.style.setProperty('fill', 'transparent', 'important');
    pathElement.style.setProperty('fill-opacity', '1', 'important');
  } else {
    // Use both setAttribute and style to ensure the color is applied
    if (useSetAttribute) {
      pathElement.setAttribute('fill', color);
    }
    pathElement.style.setProperty('fill', color, 'important');

    // Get color-specific opacity from the color definition
    const opacity = getBaseOpacity(panelId, material, panelColors, panelColorIds);
    pathElement.style.setProperty('fill-opacity', opacity.toString(), 'important');
  }

  // Set stroke color and width based on transparent acrylic type
  let strokeColor = '#000000'; // default black
  let strokeWidth: string = STROKE_WIDTH.default;

  if (isTransparentAcrylic) {
    strokeWidth = STROKE_WIDTH.transparent;
    if (color === TRANSPARENT_ACRYLIC_COLORS.frostClear) {
      strokeColor = TRANSPARENT_ACRYLIC_COLORS.frostClearEdge;
    }
    // Clear stays #000000 (default)
  }

  pathElement.style.stroke = strokeColor;
  pathElement.style.strokeWidth = strokeWidth;
  pathElement.setAttribute('vector-effect', 'non-scaling-stroke');

  return { strokeColor, strokeWidth, isTransparentAcrylic };
}

// Helper function to set up panel event handlers
function setupPanelEventHandlers(
  pathElement: SVGPathElement,
  panelId: string,
  selectedPanel: string | null,
  material: string | undefined,
  panelColors: { [key: string]: string },
  panelColorIds: { [key: string]: string } | undefined,
  strokeInfo: StrokeInfo,
): void {
  const { strokeColor, strokeWidth, isTransparentAcrylic } = strokeInfo;

  // Add hover effect with better transitions
  pathElement.style.transition = 'all 0.2s ease-out';

  // Add selected state visual feedback
  if (selectedPanel === panelId) {
    pathElement.style.filter = DROP_SHADOW_SELECTED;
    // Use thicker stroke for selected (4px for normal, 8px for transparent)
    const selectedStrokeWidth = isTransparentAcrylic
      ? STROKE_WIDTH.selectedTransparent
      : STROKE_WIDTH.selectedNormal;
    pathElement.style.strokeWidth = selectedStrokeWidth;
    pathElement.style.stroke = SELECTION_COLOR_SELECTED;
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
      pathElement.style.filter = DROP_SHADOW_HOVER;
      // Use thicker stroke for hover (2px for normal, 6px for transparent)
      const hoverStrokeWidth = isTransparentAcrylic
        ? STROKE_WIDTH.hoverTransparent
        : STROKE_WIDTH.hoverNormal;
      pathElement.style.strokeWidth = hoverStrokeWidth;
      pathElement.style.stroke = SELECTION_COLOR_HOVER;

      // Subtle brightness adjustment instead of opacity
      if (material === 'acrylic') {
        pathElement.style.filter = BRIGHTNESS_FILTER_HOVER;
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
    const baseOpacity = getBaseOpacity(panelId, material, panelColors, panelColorIds);
    pathElement.style.setProperty('fill-opacity', baseOpacity.toString(), 'important');
  };
}

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
        // Validate caseType to prevent path traversal and ensure only known models are loaded
        // This prevents loading arbitrary files via ../ or other path manipulation
        const validCaseTypes = [
          'zudo-block-40-ACR-A',
          'zudo-block-40-ACR-B',
          'zudo-block-40-3DP-A',
          'zudo-block-40-3DP-B',
          'zudo-block-60-ACR-A',
          'zudo-block-60-ACR-B',
          'zudo-block-60-3DP-A',
          'zudo-block-60-3DP-B',
          'zudo-block-40x2-ACR-A',
          'zudo-block-40x2-ACR-B',
          'zudo-block-40x2-3DP-A',
          'zudo-block-40x2-3DP-B',
          'zudo-block-60x2-ACR-A',
          'zudo-block-60x2-ACR-B',
          'zudo-block-60x2-3DP-A',
          'zudo-block-60x2-3DP-B',
          '10box-shallow-3dp',
          '10box-deep-3dp',
          '10box-3dp',
          '5box-shallow-3dp',
          '5box-deep-3dp',
          'zudo-block-60-open-ACR-A',
          'zudo-block-60-open-ACR-B',
          'zudo-block-60-open-upgrade-ACR',
          'zudo-block-60-open-3DP-A',
          'zudo-block-60-open-3DP-B',
          'zudo-block-60-open-upgrade-3DP',
          'zudo-stand-40',
          'zudo-stand-40x2',
          'zudo-stand-60',
          'zudo-stand-60x2',
        ];

        if (!validCaseTypes.includes(caseType)) {
          console.error(`Invalid case type: ${caseType}`);
          onLoadingChange?.(false);
          return;
        }

        // Dynamically select SVG path based on caseType
        const svgPath = `/svg/${caseType}.svg`;

        const response = await fetch(svgPath);
        const svgText = await response.text();

        if (svgContainerRef.current) {
          // Use DOMParser for safer SVG injection
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
          const svg = svgDoc.querySelector('svg');

          // Check for parsing errors
          const parseError = svgDoc.querySelector('parsererror');
          if (parseError || !svg) {
            console.error('Failed to parse SVG:', parseError?.textContent || 'Invalid SVG');
            onLoadingChange?.(false);
            return;
          }

          // Clear container and append parsed SVG
          svgContainerRef.current.innerHTML = '';
          svgContainerRef.current.appendChild(document.importNode(svg, true));

          // Get the SVG element from the container (now in the DOM)
          const svgInDom = svgContainerRef.current.querySelector('svg');

          // Ensure the SVG scales properly and centers
          if (svgInDom) {
            // Remove width/height attributes to let viewBox handle sizing
            svgInDom.removeAttribute('width');
            svgInDom.removeAttribute('height');
            // Set proper styling for centering and scaling
            svgInDom.style.width = '100%';
            svgInDom.style.height = '100%';
            svgInDom.style.maxWidth = '100%';
            svgInDom.style.maxHeight = '100%';
            svgInDom.style.display = 'block';
            svgInDom.style.margin = 'auto';

            // For 10BOX model, 5BOX model, Open models, and Stand models, immediately set all panels to black to prevent color flash
            if (is10BoxModel || is5BoxModel || isOpenModel || isStandModel) {
              // Select the appropriate color mapping based on model type
              let colorToPanelMap: { [key: string]: string };
              if (caseType === '10box-shallow-3dp') {
                colorToPanelMap = COLOR_TO_PANEL_10BOX_SHALLOW;
              } else if (caseType === '10box-deep-3dp') {
                colorToPanelMap = COLOR_TO_PANEL_10BOX_DEEP;
              } else if (caseType === '5box-shallow-3dp' || caseType === '5box-deep-3dp') {
                colorToPanelMap = COLOR_TO_PANEL_5BOX_SHALLOW;
              } else if (caseType.includes('upgrade')) {
                colorToPanelMap = COLOR_TO_PANEL_OPEN_UPGRADE;
              } else if (isStandModel) {
                colorToPanelMap = COLOR_TO_PANEL_ZUDO_STAND;
              } else {
                colorToPanelMap = COLOR_TO_PANEL_OPEN_2;
              }

              // Get all paths (including the one without fill style for Panel 2)
              const allPaths = svgInDom.querySelectorAll('path');
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
              const styleElement = svgInDom.querySelector('style');
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
          if (svgInDom) {
            addPatternsToSvg(svgInDom);
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
          const pathElement = path as SVGPathElement;

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
            let color = panelColors[panelId] || DEFAULT_PANEL_COLOR;

            // Validate color to prevent CSS injection attacks (e.g., url() values)
            if (!isValidColor(color)) {
              console.warn(`Invalid color value detected: ${color}. Using default color.`);
              color = DEFAULT_PANEL_COLOR;
            }

            // Apply panel styles and get stroke info
            const strokeInfo = applyPanelStyles(
              pathElement,
              color,
              material,
              panelColorIds,
              panelId,
              panelColors,
              false, // Don't use setAttribute for inline-style models
            );

            // Set up event handlers
            setupPanelEventHandlers(
              pathElement,
              panelId,
              selectedPanel,
              material,
              panelColors,
              panelColorIds,
              strokeInfo,
            );
          }
        });
      } else {
        // Handle regular models with class-based mappings
        // Add click handlers to all paths
        Object.entries(CLASS_TO_PANEL).forEach(([className, panelId]) => {
          const paths = svg.querySelectorAll(`.${className}`);

          paths.forEach((path: Element) => {
            const pathElement = path as SVGPathElement;
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
            let color = panelColors[panelId] || DEFAULT_PANEL_COLOR;

            // Validate color to prevent CSS injection attacks (e.g., url() values)
            if (!isValidColor(color)) {
              console.warn(`Invalid color value detected: ${color}. Using default color.`);
              color = DEFAULT_PANEL_COLOR;
            }

            // Apply panel styles and get stroke info
            const strokeInfo = applyPanelStyles(
              pathElement,
              color,
              material,
              panelColorIds,
              panelId,
              panelColors,
              true, // Use setAttribute for class-based models
            );

            // Set up event handlers
            setupPanelEventHandlers(
              pathElement,
              panelId,
              selectedPanel,
              material,
              panelColors,
              panelColorIds,
              strokeInfo,
            );
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
