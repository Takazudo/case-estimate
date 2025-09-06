import { useEffect, useRef, useState } from 'react';

const AllInOneSVG = ({ caseType, panelColors, onPanelClick, selectedPanel }) => {
  const svgContainerRef = useRef(null);
  const [svgLoaded, setSvgLoaded] = useState(false);

  // Default black color for all panels
  const defaultPanelColor = '#1f2937';

  // Timing constant for SVG rendering delay
  const SVG_RENDER_DELAY_MS = 50;

  // Load and inject the SVG
  useEffect(() => {
    const loadSVG = async () => {
      try {
        // Dynamically select SVG path based on caseType
        const svgPath = `/svg/zudo-block-${caseType}.svg`;

        const response = await fetch(svgPath);
        const svgText = await response.text();

        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = svgText;

          // Ensure the SVG scales properly
          const svg = svgContainerRef.current.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.maxWidth = '800px';
            svg.style.maxHeight = '680px';
            svg.style.width = '100%';
            svg.style.height = 'auto';

            // Remove or override the style element that contains default colors
            const styleElement = svg.querySelector('style');
            if (styleElement) {
              // Override the CSS rules to use black as default
              const classes = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
              const newStyles = classes
                .map((cls) => `.${cls}{fill:${defaultPanelColor};}`)
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

    // Map SVG classes to panel IDs based on the SVG structure
    // These mappings are based on analyzing the SVG colors and positions
    const classToPanel = {
      b: 'left-side', // Black panel (left side)
      c: 'right-side', // Magenta panel (right side)
      d: 'top-front', // Green panel (top section)
      e: 'top-back', // Red panel (second top section)
      f: 'bottom-front', // Yellow panel (bottom section)
      g: 'bottom-back', // Green panel (second bottom section)
      h: 'center-bottom', // Brown panel (lower center)
      i: 'center-top', // Orange panel (upper center)
    };

    // Small delay to ensure SVG is fully rendered
    const timeoutId = setTimeout(() => {
      const svg = svgContainerRef.current.querySelector('svg');
      if (!svg) return;

      // Add click handlers to all paths
      Object.entries(classToPanel).forEach(([className, panelId]) => {
        const paths = svg.querySelectorAll(`.${className}`);

        paths.forEach((path) => {
          // Set cursor style
          path.style.cursor = 'pointer';

          // Remove old event listener if it exists
          path.onclick = null;

          // Add click handler
          path.onclick = (e) => {
            e.stopPropagation();
            onPanelClick(panelId);
          };

          // Update color if specified, otherwise use default black
          const color = panelColors[panelId] || defaultPanelColor;
          // Use both setAttribute and style to ensure the color is applied
          path.setAttribute('fill', color);
          path.style.fill = color;
          // Add !important to override any CSS rules
          path.style.setProperty('fill', color, 'important');

          // Add hover effect
          path.style.transition = 'opacity 0.2s, transform 0.2s';

          // Add selected state visual feedback
          if (selectedPanel === panelId) {
            path.style.filter = 'drop-shadow(0 0 15px rgba(59, 130, 246, 1))';
            path.style.strokeWidth = '3';
            path.style.stroke = '#3B82F6';
            path.style.opacity = '1';
          } else {
            path.style.filter = 'none';
            path.style.strokeWidth = '0';
            path.style.stroke = 'none';
            path.style.opacity = '1';
          }

          // Hover effects
          path.onmouseenter = () => {
            if (selectedPanel !== panelId) {
              path.style.opacity = '0.8';
            }
          };

          path.onmouseleave = () => {
            path.style.opacity = '1';
          };
        });
      });
    }, SVG_RENDER_DELAY_MS); // Delay to ensure DOM is ready

    return () => clearTimeout(timeoutId);
  }, [svgLoaded, panelColors, selectedPanel, onPanelClick, defaultPanelColor]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        ref={svgContainerRef}
        className="max-w-full max-h-full"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
