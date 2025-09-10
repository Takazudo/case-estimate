import { useEffect, useRef, useState } from 'react';

interface AllInOneSVGProps {
  caseType: string;
  panelColors: { [key: string]: string };
  onPanelClick: (panelId: string) => void;
  selectedPanel: string | null;
  material?: string;
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
}: AllInOneSVGProps) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [svgLoaded, setSvgLoaded] = useState(false);

  // Determine which class mapping to use based on model type
  const isX2Model = caseType.includes('x2');
  const CLASS_TO_PANEL = isX2Model ? CLASS_TO_PANEL_12 : CLASS_TO_PANEL_8;

  // Load and inject the SVG
  useEffect(() => {
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

          setSvgLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load SVG:', error);
      }
    };

    loadSVG();
  }, [caseType, isX2Model]);

  // Handle clicks and color updates
  useEffect(() => {
    if (!svgLoaded || !svgContainerRef.current) return;

    // Small delay to ensure SVG is fully rendered
    const timeoutId = setTimeout(() => {
      const svg = svgContainerRef.current?.querySelector('svg');
      if (!svg) return;

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
    }, SVG_RENDER_DELAY_MS); // Delay to ensure DOM is ready

    return () => clearTimeout(timeoutId);
  }, [svgLoaded, panelColors, selectedPanel, onPanelClick, material, CLASS_TO_PANEL]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        ref={svgContainerRef}
        className="w-full h-full max-w-[800px] max-h-[700px] flex items-center justify-center"
      />
      {!svgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-zd-gray">Loading visualization...</div>
        </div>
      )}
    </div>
  );
};

export default AllInOneSVG;
