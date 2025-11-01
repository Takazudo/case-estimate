import { isPanelPattern, getPanelPatternFallbackColor } from '@/utils/panel-patterns';

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
