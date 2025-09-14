import { useEffect, useRef, useState } from 'react';

interface AllInOneSVGProps {
  caseType: string;
  panelColors: { [key: string]: string };
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

// For 10BOX Lite model - maps fill colors to panel IDs (confirmed from image)
// Based on the SVG order and visual confirmation:
// Position 1: #2e3192 (dark blue) -> Panel 7 (main-side3)
// Position 2: #00aeef (cyan) -> Panel 8 (main-side4)
// Position 3: #754c29 (brown) -> Panel 11 (main-exchange-side1)
// Position 4: no fill/black -> Panel 2 (main-side2)
// Position 5: #00a99d (teal) -> Panel 1 (main-side1)
// Position 6: #c49a6c (tan) -> Panel 12 (main-exchange-side2)
// Position 7: #ef4136 (red) -> Panel 3 (main-back1)
// Position 8: #00a651 (green) -> Panel 6 (main-front)
// Position 9: #fff200 (yellow) -> Panel 5 (main-bottom2)
// Position 10: #ed1c24 (darker red) -> Panel 4 (main-bottom1)
const COLOR_TO_PANEL_10BOX: { [key: string]: string } = {
  '#00a99d': 'main-side1', // Panel 1: メイン: サイド1 (teal - left main side)
  // Panel 2 (main-side2) has no fill style, will be handled as position 4
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

// Default black color for all panels
const DEFAULT_PANEL_COLOR = '#1f2937';

// Timing constant for SVG rendering delay
const SVG_RENDER_DELAY_MS = 50;

const AllInOneSVG = ({
  caseType,
  panelColors,
  onPanelClick,
  selectedPanel,
  material,
  onLoadingChange,
}: AllInOneSVGProps) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [svgLoaded, setSvgLoaded] = useState(false);

  // Determine which class mapping to use based on model type
  const isX2Model = caseType.includes('x2');
  const is10BoxModel = caseType === '10box-lite';
  const CLASS_TO_PANEL = isX2Model ? CLASS_TO_PANEL_12 : CLASS_TO_PANEL_8;

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

            // For 10BOX model, immediately set all panels to black to prevent color flash
            if (is10BoxModel) {
              // Get all paths, including those without fill styles
              const allPaths = svg.querySelectorAll('path');
              const paths = Array.from(allPaths).filter((path) => {
                const style = path.getAttribute('style') || '';
                // Include paths with fill styles OR path at position 4 (panel 2)
                return style.includes('fill:') || Array.from(allPaths).indexOf(path) === 3; // index 3 = position 4
              });

              paths.forEach((path: Element) => {
                const pathElement = path as HTMLElement;
                const styleAttr = pathElement.getAttribute('style') || '';
                const fillMatch = styleAttr.match(/fill:\s*([^;]+)/i);

                let panelId: string | undefined;

                // Check if this is the path at position 4 (panel 2 - main-side2)
                if (Array.from(allPaths).indexOf(path as SVGPathElement) === 3) {
                  // index 3 = position 4
                  panelId = 'main-side2'; // Panel 2: メイン: サイド2 (black panel)
                } else if (fillMatch) {
                  const originalColor = fillMatch[1].trim();
                  panelId = COLOR_TO_PANEL_10BOX[originalColor];
                }

                if (panelId) {
                  // Store the panel ID for later use
                  pathElement.setAttribute('data-panel-id', panelId);
                  // Immediately set to black to prevent color flash
                  pathElement.style.fill = DEFAULT_PANEL_COLOR;
                  pathElement.style.setProperty('fill', DEFAULT_PANEL_COLOR, 'important');
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

          setSvgLoaded(true);
          onLoadingChange?.(false);
        }
      } catch (error) {
        console.error('Failed to load SVG:', error);
        onLoadingChange?.(false);
      }
    };

    loadSVG();
  }, [caseType, isX2Model, is10BoxModel, onLoadingChange]);

  // Handle clicks and color updates
  useEffect(() => {
    if (!svgLoaded || !svgContainerRef.current) return;

    // Small delay to ensure SVG is fully rendered
    const timeoutId = setTimeout(() => {
      const svg = svgContainerRef.current?.querySelector('svg');
      if (!svg) return;

      if (is10BoxModel) {
        // Handle 10BOX Lite model which uses inline styles
        // Select all paths with data-panel-id (which were set during SVG load)
        const paths = svg.querySelectorAll('path[data-panel-id]');

        paths.forEach((path: Element) => {
          const pathElement = path as HTMLElement;

          // Check if we've already identified this panel
          let panelId = pathElement.getAttribute('data-panel-id');

          // Panel ID should already be set during SVG load
          // This is just a fallback in case it's not set
          if (!panelId) {
            const styleAttr = pathElement.getAttribute('style') || '';
            const fillMatch = styleAttr.match(/fill:\s*([^;]+)/i);

            if (fillMatch) {
              const originalColor = fillMatch[1].trim();
              panelId = COLOR_TO_PANEL_10BOX[originalColor];

              if (panelId) {
                pathElement.setAttribute('data-panel-id', panelId);
              }
            }
          }

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
            // Use both setAttribute and style to ensure the color is applied
            pathElement.style.fill = color;
            pathElement.style.setProperty('fill', color, 'important');

            // Apply opacity for acrylic material to simulate transparency
            if (material === 'acrylic') {
              pathElement.style.setProperty('fill-opacity', '0.8', 'important');
            } else {
              pathElement.style.setProperty('fill-opacity', '1', 'important');
            }

            // Add hover effect with better transitions
            pathElement.style.transition = 'all 0.2s ease-out';

            // Add selected state visual feedback
            if (selectedPanel === panelId) {
              pathElement.style.filter = 'drop-shadow(0 0 12px oklch(54.6% 0.245 262.881 / 0.9))';
              pathElement.style.strokeWidth = '4';
              pathElement.style.stroke = 'oklch(54.6% 0.245 262.881 / 0.9)';
            } else {
              pathElement.style.filter = 'none';
              pathElement.style.strokeWidth = '0';
              pathElement.style.stroke = 'none';
            }

            // Hover effects - more visible for acrylic panels
            pathElement.onmouseenter = () => {
              if (selectedPanel !== panelId) {
                // Add drop shadow and border for better visibility
                pathElement.style.filter = 'drop-shadow(0 0 4px oklch(54.6% 0.245 262.881 / 0.6))';
                pathElement.style.strokeWidth = '2';
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
                // Remove hover effects
                pathElement.style.filter = 'none';
                pathElement.style.strokeWidth = '0';
                pathElement.style.stroke = 'none';
              }

              // Always restore base opacity
              const baseOpacity = material === 'acrylic' ? '0.8' : '1';
              pathElement.style.setProperty('fill-opacity', baseOpacity, 'important');
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
            // Use both setAttribute and style to ensure the color is applied
            pathElement.setAttribute('fill', color);
            pathElement.style.fill = color;
            // Add !important to override any CSS rules
            pathElement.style.setProperty('fill', color, 'important');

            // Apply opacity for acrylic material to simulate transparency
            if (material === 'acrylic') {
              pathElement.style.setProperty('fill-opacity', '0.8', 'important');
            } else {
              pathElement.style.setProperty('fill-opacity', '1', 'important');
            }

            // Add hover effect with better transitions
            pathElement.style.transition = 'all 0.2s ease-out';
            pathElement.style.cursor = 'pointer';

            // Add selected state visual feedback
            if (selectedPanel === panelId) {
              pathElement.style.filter = 'drop-shadow(0 0 12px oklch(54.6% 0.245 262.881 / 0.9))';
              pathElement.style.strokeWidth = '4';
              pathElement.style.stroke = 'oklch(54.6% 0.245 262.881 / 0.9)';
            } else {
              pathElement.style.filter = 'none';
              pathElement.style.strokeWidth = '0';
              pathElement.style.stroke = 'none';
            }

            // Hover effects - more visible for acrylic panels
            pathElement.onmouseenter = () => {
              if (selectedPanel !== panelId) {
                // Add drop shadow and border for better visibility
                pathElement.style.filter = 'drop-shadow(0 0 4px oklch(54.6% 0.245 262.881 / 0.6))';
                pathElement.style.strokeWidth = '2';
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
                // Remove hover effects
                pathElement.style.filter = 'none';
                pathElement.style.strokeWidth = '0';
                pathElement.style.stroke = 'none';
              }

              // Always restore base opacity
              const baseOpacity = material === 'acrylic' ? '0.8' : '1';
              pathElement.style.setProperty('fill-opacity', baseOpacity, 'important');
            };
          });
        });
      }
    }, SVG_RENDER_DELAY_MS); // Delay to ensure DOM is ready

    return () => clearTimeout(timeoutId);
  }, [svgLoaded, panelColors, selectedPanel, onPanelClick, material, CLASS_TO_PANEL, is10BoxModel]);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div ref={svgContainerRef} className="w-full h-full flex items-center justify-center" />
    </div>
  );
};

export default AllInOneSVG;
