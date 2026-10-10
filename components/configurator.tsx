'use client';

import { batch, computed, getScope, Show, signal } from '@takazudo/zfb/zudo-react';
import { cases } from '@/data/cases';
import { colors } from '@/data/colors';
import type { Color, Preset, PanelColorIds } from '@/types';
import { decodeCase, decodePanelColors } from '@/utils/url-encoder';
import VisualizationPanel from '@/components/visualization-panel';
import ControlsSidebar from '@/components/controls-sidebar';
import { ColorSelectorModal } from '@/components/modal/color-selector-modal';
import { OrderInfoModal } from '@/components/modal/order-info-modal';
import { useUrlPersistence } from '@/hooks/use-url-persistence';
import {
  applyPresetColorsWithIds,
  isPresetActive as checkPresetActive,
  derivePanelColors,
} from '@/utils/panel-colors';

const STORAGE_KEYS = { BG_COLOR: 'takazudo_bg_color', GRID_COLOR: 'takazudo_grid_color' } as const;
const DEFAULT_COLORS = { BG_COLOR: '#a8a8a8', GRID_COLOR: '#969696' } as const;

function initializeDefaultColorIds(caseType: string): PanelColorIds {
  const caseData = cases[caseType];
  if (!caseData?.material) return {};
  const defaultColorId = colors[caseData.material]?.[0]?.id;
  if (!defaultColorId) return {};
  const colorIds: PanelColorIds = {};
  caseData.panels.forEach((panel) => {
    colorIds[panel.id] = defaultColorId;
  });
  return colorIds;
}

function getInitialStateFromUrl(): { selectedCase: string | null; panelColorIds: PanelColorIds } {
  const params = new URLSearchParams(window.location.search);
  const caseParam = params.get('c');
  const decodedCase = caseParam ? decodeCase(caseParam) : null;
  const selectedCase =
    decodedCase && cases[decodedCase] ? decodedCase : Object.keys(cases)[0] || null;
  let panelColorIds = initializeDefaultColorIds(selectedCase || '');
  if (selectedCase === decodedCase && params.get('p')) {
    try {
      panelColorIds = { ...panelColorIds, ...decodePanelColors(params.get('p')!) };
    } catch (error) {
      console.error('Failed to decode panel colors from URL', error);
    }
  }
  return { selectedCase, panelColorIds };
}

function readStoredColor(key: string, fallback: string): string {
  try {
    const stored = localStorage.getItem(key);
    return stored && /^#[0-9a-f]{6}$/i.test(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}

function Configurator() {
  const scope = getScope();
  const selectedCase = signal<string | null>(null);
  const selectedPanel = signal<string | null>(null);
  const panelColorIds = signal<PanelColorIds>({});
  const isLoadingSvg = signal(false);
  const isColorModalOpen = signal(false);
  const isOrderInfoModalOpen = signal(false);
  const bgColor = signal<string>(DEFAULT_COLORS.BG_COLOR);
  const gridColor = signal<string>(DEFAULT_COLORS.GRID_COLOR);
  let modalPanelId: string | null = null;
  const currentCase = computed(() => (selectedCase.value ? cases[selectedCase.value] : null));
  const material = computed(() => currentCase.value?.material);
  const panelColors = computed(() => derivePanelColors(panelColorIds.value, material.value));
  const colorMap = computed(() => {
    const map: Record<string, string> = {};
    if (material.value)
      colors[material.value]?.forEach((color) => {
        map[color.value] = color.name;
      });
    return map;
  });
  const selectedColor = computed((): Color | null => {
    const targetPanelId = modalPanelId || selectedPanel.value;
    if (!targetPanelId || !material.value) return null;
    const colorValue = panelColors.value[targetPanelId];
    return {
      id: panelColorIds.value[targetPanelId] || 'default',
      name: colorMap.value[colorValue] || 'Default',
      value: colorValue || '#f3f4f6',
      material: '',
    };
  });

  scope.onActivate(() => {
    const initialState = getInitialStateFromUrl();
    batch(() => {
      selectedCase.value = initialState.selectedCase;
      panelColorIds.value = initialState.panelColorIds;
      bgColor.value = readStoredColor(STORAGE_KEYS.BG_COLOR, DEFAULT_COLORS.BG_COLOR);
      gridColor.value = readStoredColor(STORAGE_KEYS.GRID_COLOR, DEFAULT_COLORS.GRID_COLOR);
    });
  });
  useUrlPersistence({ selectedCase, panelColorIds });

  const setBgColor = (value: string) => {
    bgColor.value = value;
    if (/^#[0-9a-f]{6}$/i.test(value))
      try {
        localStorage.setItem(STORAGE_KEYS.BG_COLOR, value);
      } catch {
        /* storage unavailable */
      }
  };
  const setGridColor = (value: string) => {
    gridColor.value = value;
    if (/^#[0-9a-f]{6}$/i.test(value))
      try {
        localStorage.setItem(STORAGE_KEYS.GRID_COLOR, value);
      } catch {
        /* storage unavailable */
      }
  };
  const handlePanelClick = (panelId: string) => {
    modalPanelId = panelId;
    selectedPanel.value = panelId;
    isColorModalOpen.value = true;
  };
  const handleModalColorSelect = (color: Color) => {
    const targetPanelId = modalPanelId || selectedPanel.value;
    if (targetPanelId) panelColorIds.value = { ...panelColorIds.value, [targetPanelId]: color.id };
    isColorModalOpen.value = false;
  };
  const handleCaseSelect = (caseType: string) => {
    if (!caseType || !cases[caseType]) return;
    const caseData = cases[caseType];
    const firstPreset = caseData.material ? colors.presets[caseData.material]?.[0] : null;
    const colorIds =
      firstPreset && caseData.material
        ? applyPresetColorsWithIds(firstPreset, caseType, caseData.material).colorIds
        : initializeDefaultColorIds(caseType);
    batch(() => {
      selectedCase.value = caseType;
      selectedPanel.value = null;
      panelColorIds.value = colorIds;
      isColorModalOpen.value = false;
    });
  };
  const handlePresetSelect = (preset: Preset) => {
    if (!selectedCase.value || !material.value) return;
    panelColorIds.value = applyPresetColorsWithIds(
      preset,
      selectedCase.value,
      material.value,
    ).colorIds;
  };
  const isPresetActive = (preset: Preset) =>
    checkPresetActive(
      preset,
      panelColors.value,
      selectedCase.value,
      material.value,
      panelColorIds.value,
    );

  return (
    <div class="h-full relative">
      <Show when={isLoadingSvg}>
        {() => (
          <div class="absolute inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black opacity-50" />
            <div class="loader relative z-10" />
          </div>
        )}
      </Show>
      <Show when={computed(() => !!selectedCase.value)}>
        {() => (
          <div class="h-full grid grid-cols-1 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_600px]">
            <VisualizationPanel
              selectedCase={selectedCase}
              panelColors={panelColors}
              panelColorIds={panelColorIds}
              onPanelClick={handlePanelClick}
              selectedPanel={selectedPanel}
              material={material}
              bgColor={bgColor}
              gridColor={gridColor}
              onLoadingChange={(loading) => {
                isLoadingSvg.value = loading;
              }}
            />
            <ControlsSidebar
              selectedCase={selectedCase}
              material={material}
              onPresetSelect={handlePresetSelect}
              isPresetActive={isPresetActive}
              panels={computed(() => currentCase.value?.panels || [])}
              panelColors={panelColors}
              selectedPanel={selectedPanel}
              onPanelSelect={(id) => {
                if (id) handlePanelClick(id);
                else selectedPanel.value = null;
              }}
              colorMap={colorMap}
              onCaseSelect={handleCaseSelect}
              bgColor={bgColor}
              gridColor={gridColor}
              onBgColorChange={setBgColor}
              onGridColorChange={setGridColor}
              onOrderInfoClick={() => {
                isOrderInfoModalOpen.value = true;
              }}
            />
          </div>
        )}
      </Show>
      <Show when={computed(() => !!material.value)}>
        {() => (
          <ColorSelectorModal
            isOpen={isColorModalOpen}
            material={computed(() => material.value!)}
            selectedColor={selectedColor}
            onColorSelect={handleModalColorSelect}
            onClose={() => {
              isColorModalOpen.value = false;
              modalPanelId = null;
            }}
          />
        )}
      </Show>
      <Show when={computed(() => !!selectedCase.value && !!material.value)}>
        {() => (
          <OrderInfoModal
            isOpen={isOrderInfoModalOpen}
            selectedCase={computed(() => selectedCase.value!)}
            panelColorIds={panelColorIds}
            material={computed(() => material.value!)}
            onClose={() => {
              isOrderInfoModalOpen.value = false;
            }}
          />
        )}
      </Show>
    </div>
  );
}

export default Configurator;
