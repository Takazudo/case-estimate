import { cases } from '@/data/cases';
import { colors } from '@/data/colors';
import type { Preset, PanelColorIds } from '@/types';
import { isPresetActive } from './panel-colors';

interface OrderInfoParams {
  selectedCase: string;
  panelColorIds: PanelColorIds;
  material: 'acrylic' | '3dp';
  currentUrl: string;
}

/**
 * Detect which preset is currently active, if any
 */
export const detectActivePreset = (
  selectedCase: string,
  panelColorIds: PanelColorIds,
  material: 'acrylic' | '3dp',
): Preset | null => {
  const availablePresets = colors.presets[material] || [];
  const caseData = cases[selectedCase];
  if (!caseData) return null;

  // Derive panel colors for comparison
  const panelColors: { [key: string]: string } = {};
  Object.entries(panelColorIds).forEach(([panelId, colorId]) => {
    const color = colors[material].find((c) => c.id === colorId);
    if (color) {
      panelColors[panelId] = color.value;
    }
  });

  for (const preset of availablePresets) {
    if (isPresetActive(preset, panelColors, selectedCase, material, panelColorIds)) {
      return preset;
    }
  }

  return null;
};

/**
 * Get human-readable case name in Japanese
 */
export const getCaseDisplayName = (caseKey: string): string => {
  const caseData = cases[caseKey];
  if (!caseData) return caseKey;

  // Return the case name from the data
  return caseData.name;
};

/**
 * Generate formatted order information text for Mercari Shops
 */
export const generateOrderInfo = (params: OrderInfoParams): string => {
  const { selectedCase, panelColorIds, material, currentUrl } = params;

  const caseData = cases[selectedCase];
  if (!caseData) {
    return 'エラー: ケース情報が見つかりません';
  }

  const sections: string[] = [];

  // Section 1: Model
  sections.push('## モデル');
  sections.push(getCaseDisplayName(selectedCase));
  sections.push('');

  // Section 2: Preset
  sections.push('## プリセット');
  const activePreset = detectActivePreset(selectedCase, panelColorIds, material);
  if (activePreset) {
    sections.push(activePreset.name);
  } else {
    sections.push('カスタム');
  }
  sections.push('');

  // Section 3: Panel customization details
  sections.push('## パネルカスタマイズ情報');
  caseData.panels.forEach((panel) => {
    const colorId = panelColorIds[panel.id];
    const color = colors[material].find((c) => c.id === colorId);
    const colorName = color ? color.name : '不明';
    sections.push(`${panel.name}: ${colorName}`);
  });
  sections.push('');

  // Section 4: URL
  sections.push('## URL');
  sections.push(currentUrl);

  return sections.join('\n');
};
