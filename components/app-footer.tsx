import type { Reactive } from '@/utils/reactive';

import BackgroundColorPicker from './background-color-picker';

interface AppFooterProps {
  bgColor: Reactive<string>;
  gridColor: Reactive<string>;
  onBgColorChange: (color: string) => void;
  onGridColorChange: (color: string) => void;
}

export default function AppFooter({
  bgColor,
  gridColor,
  onBgColorChange,
  onGridColorChange,
}: AppFooterProps) {
  return (
    <footer class="bg-zd-gray2 border-t border-zd-gray">
      <div class="px-hgap-sm py-vgap-xs">
        <div class="flex items-center justify-between">
          <BackgroundColorPicker
            bgColor={bgColor as string}
            gridColor={gridColor as string}
            onBgColorChange={onBgColorChange}
            onGridColorChange={onGridColorChange}
          />
          <div class="text-xs md:text-sm text-zd-gray">© 2025 Takazudo Modular</div>
        </div>
      </div>
    </footer>
  );
}
