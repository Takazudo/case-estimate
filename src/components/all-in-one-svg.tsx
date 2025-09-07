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
const CLASS_TO_PANEL: { [key: string]: string } = {
  b: 'side1', // Panel 1: Left side (black)
  c: 'side2', // Panel 2: Right side (magenta)
  i: 'front1', // Panel 3: Top front (orange)
  e: 'front2', // Panel 4: Second top (red - behind panel 3)
  d: 'bottom1', // Panel 5: Center upper (green)
  g: 'bottom2', // Panel 6: Center lower (green)
  f: 'back1', // Panel 7: Bottom front (yellow)
  h: 'back2', // Panel 8: Bottom back (brown)
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
              const classes = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
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
  }, [caseType]);

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

          // Add hover effect
          pathElement.style.transition = 'opacity 0.2s, transform 0.2s';

          // Add selected state visual feedback
          if (selectedPanel === panelId) {
            pathElement.style.filter = 'drop-shadow(0 0 15px rgba(59, 130, 246, 1))';
            pathElement.style.strokeWidth = '3';
            pathElement.style.stroke = '#3B82F6';
          } else {
            pathElement.style.filter = 'none';
            pathElement.style.strokeWidth = '0';
            pathElement.style.stroke = 'none';
          }

          // Hover effects
          pathElement.onmouseenter = () => {
            if (selectedPanel !== panelId) {
              // Slightly reduce opacity on hover
              const hoverOpacity = material === 'acrylic' ? '0.7' : '0.9';
              pathElement.style.setProperty('fill-opacity', hoverOpacity, 'important');
            }
          };

          pathElement.onmouseleave = () => {
            // Restore base opacity
            const baseOpacity = material === 'acrylic' ? '0.8' : '1';
            pathElement.style.setProperty('fill-opacity', baseOpacity, 'important');
          };
        });
      });
    }, SVG_RENDER_DELAY_MS); // Delay to ensure DOM is ready

    return () => clearTimeout(timeoutId);
  }, [svgLoaded, panelColors, selectedPanel, onPanelClick, material]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div
        ref={svgContainerRef}
        className="w-full h-full flex items-center justify-center"
        style={{
          maxWidth: '600px',
          maxHeight: '500px',
        }}
      />
      {!svgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading visualization...</div>
        </div>
      )}
    </div>
  );
};

export default AllInOneSVG;
