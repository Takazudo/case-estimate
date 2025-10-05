'use client';

import { useId } from 'react';
import type { PanelPatternKey } from '@/utils/panel-patterns';
import { getPanelPatternDefinition } from '@/utils/panel-patterns';

interface PatternFillProps {
  pattern: PanelPatternKey;
  className?: string;
  viewBoxSize?: number;
}

const PatternFill = ({ pattern, className = '', viewBoxSize = 24 }: PatternFillProps) => {
  const internalId = useId();
  const definition = getPanelPatternDefinition(pattern);
  const patternId = `${definition.svgId}-${internalId}`;

  return (
    <svg className={className} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} aria-hidden="true">
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={definition.patternSize}
          height={definition.patternSize}
          patternTransform={`rotate(${definition.rotation})`}
        >
          <rect
            width={definition.patternSize}
            height={definition.patternSize}
            fill={definition.baseColor}
          />
          <rect
            x="0"
            y="0"
            width={definition.stripeWidth}
            height={definition.patternSize}
            fill={definition.accentColor}
          />
        </pattern>
      </defs>
      <rect width={viewBoxSize} height={viewBoxSize} fill={`url(#${patternId})`} />
    </svg>
  );
};

export default PatternFill;
