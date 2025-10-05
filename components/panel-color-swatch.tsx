'use client';

import type { CSSProperties, HTMLAttributes } from 'react';
import PatternFill from '@/components/pattern-fill';
import { isPanelPattern, getPanelPatternFallbackColor } from '@/utils/panel-patterns';

export interface PanelColorSwatchProps extends HTMLAttributes<HTMLSpanElement> {
  value?: string;
  fallbackColor?: string;
  patternViewBoxSize?: number;
  dataTestId?: string;
}

export const resolvePanelColorBackground = (
  value?: string,
  fallbackColor: string = '#1f2937',
): string => {
  if (!value) {
    return fallbackColor;
  }

  if (isPanelPattern(value)) {
    return getPanelPatternFallbackColor(value);
  }

  return value;
};

const PanelColorSwatch = ({
  value,
  fallbackColor = '#1f2937',
  patternViewBoxSize = 24,
  className = '',
  style,
  dataTestId = 'panel-color-swatch',
  'aria-hidden': ariaHiddenProp,
  ...rest
}: PanelColorSwatchProps) => {
  const backgroundColor = resolvePanelColorBackground(value, fallbackColor);
  const ariaHidden = ariaHiddenProp ?? true;

  return (
    <span
      data-testid={dataTestId}
      className={className}
      style={{ ...(style as CSSProperties), backgroundColor }}
      aria-hidden={ariaHidden}
      {...rest}
    >
      {value && isPanelPattern(value) && (
        <PatternFill
          pattern={value}
          className="absolute inset-0 w-full h-full"
          viewBoxSize={patternViewBoxSize}
        />
      )}
    </span>
  );
};

export default PanelColorSwatch;
