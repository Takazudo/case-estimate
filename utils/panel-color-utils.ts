import { isPanelPattern, getPanelPatternFallbackColor } from '@/utils/panel-patterns';
import { DEFAULT_PANEL_COLOR } from '@/data/colors';

export const resolvePanelColorBackground = (
  value?: string,
  fallbackColor: string = DEFAULT_PANEL_COLOR,
): string => {
  if (!value) {
    return fallbackColor;
  }

  if (isPanelPattern(value)) {
    return getPanelPatternFallbackColor(value);
  }

  return value;
};
