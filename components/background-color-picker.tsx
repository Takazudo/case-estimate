'use client';

import { computed, getScope, Show, signal } from '@takazudo/zfb/zudo-react';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';

interface BackgroundColorPickerProps {
  bgColor: Reactive<string>;
  gridColor: Reactive<string>;
  onBgColorChange: (color: string) => void;
  onGridColorChange: (color: string) => void;
}

function BackgroundColorPicker({
  bgColor,
  gridColor,
  onBgColorChange,
  onGridColorChange,
}: BackgroundColorPickerProps) {
  const scope = getScope();
  const isOpen = signal(false);
  const popupRef: { current: HTMLDivElement | null } = { current: null };
  const buttonRef: { current: HTMLButtonElement | null } = { current: null };
  const gridInputRef: { current: HTMLInputElement | null } = { current: null };
  const bgInputRef: { current: HTMLInputElement | null } = { current: null };

  // Convert hex color to grayscale value (0-255)
  const hexToGrayscale = (hex: string): number => {
    // Remove the # if present
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    // Use the average for grayscale (since we expect R=G=B for grayscale colors)
    return Math.round((r + g + b) / 3);
  };

  // Convert grayscale value (0-255) to hex color
  const grayscaleToHex = (value: number): string => {
    const hexValue = Math.round(value).toString(16).padStart(2, '0');
    return `#${hexValue}${hexValue}${hexValue}`;
  };

  // Get current grayscale values
  const bgGrayscale = computed(() => hexToGrayscale(read(bgColor)));
  const gridGrayscale = computed(() => hexToGrayscale(read(gridColor)));

  scope.effect(() => {
    if (!isOpen.value) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      )
        isOpen.value = false;
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') isOpen.value = false;
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  });
  scope.effect(() => {
    const bg = bgGrayscale.value;
    const grid = gridGrayscale.value;
    if (bgInputRef.current) bgInputRef.current.value = String(bg);
    if (gridInputRef.current) gridInputRef.current.value = String(grid);
  });

  return (
    <div class="relative">
      {/* Button showing both colors */}
      <button
        ref={buttonRef}
        on:click={() => {
          isOpen.value = !isOpen.value;
        }}
        class="flex rounded overflow-hidden border-2 border-zd-gray hover:border-zd-link transition-colors cursor-pointer"
        title="Adjust background colors"
      >
        <div class="w-8 h-8" style={computed(() => ({ 'background-color': read(gridColor) }))} />
        <div class="w-8 h-8" style={computed(() => ({ 'background-color': read(bgColor) }))} />
      </button>

      {/* Popup with sliders */}
      <Show when={isOpen}>
        {() => (
          <div
            ref={popupRef}
            class="absolute bottom-12 left-0 bg-zd-gray2 rounded-lg shadow-xl border border-zd-gray p-hgap-xs z-20"
            style={{ 'min-width': '280px' }}
          >
            {/* Close button */}
            <button
              on:click={() => {
                isOpen.value = false;
              }}
              class="absolute top-2 right-2 text-zd-gray hover:text-zd-link transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 class="font-semibold text-zd-white mb-vgap-xs">Background Settings</h3>

            {/* Grid/Line Color Slider */}
            <div class="mb-vgap-xs">
              <div class="flex items-center justify-between mb-vgap-2xs">
                <label class="text-zd-gray font-medium">Line</label>
                <div class="flex items-center gap-hgap-2xs">
                  <div
                    class="w-6 h-6 rounded border border-zd-gray"
                    style={computed(() => ({ 'background-color': read(gridColor) }))}
                  />
                  <span class="text-sm text-zd-gray font-mono w-12">
                    {computed(() => Math.round((gridGrayscale.value / 255) * 100))}%
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                ref={gridInputRef}
                value={String(gridGrayscale.value)}
                on:input={(e) => {
                  const value = parseInt(e.currentTarget.value);
                  onGridColorChange(grayscaleToHex(value));
                }}
                class="w-full h-2 bg-zd-gray rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #000000 0%, #ffffff 100%)`,
                }}
              />
            </div>

            {/* Background Color Slider */}
            <div class="mb-vgap-2xs">
              <div class="flex items-center justify-between mb-vgap-2xs">
                <label class="text-zd-gray font-medium">Background</label>
                <div class="flex items-center gap-hgap-2xs">
                  <div
                    class="w-6 h-6 rounded border border-zd-gray"
                    style={computed(() => ({ 'background-color': read(bgColor) }))}
                  />
                  <span class="text-sm text-zd-gray font-mono w-12">
                    {computed(() => Math.round((bgGrayscale.value / 255) * 100))}%
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                ref={bgInputRef}
                value={String(bgGrayscale.value)}
                on:input={(e) => {
                  const value = parseInt(e.currentTarget.value);
                  onBgColorChange(grayscaleToHex(value));
                }}
                class="w-full h-2 bg-zd-gray rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #000000 0%, #ffffff 100%)`,
                }}
              />
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}

export default BackgroundColorPicker;
