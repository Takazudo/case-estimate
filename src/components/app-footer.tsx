import BackgroundColorPicker from './background-color-picker';

interface AppFooterProps {
  bgColor: string;
  gridColor: string;
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
    <footer className="bg-zd-gray2 border-t border-zd-gray">
      <div className="px-hgap-sm py-vgap-xs">
        <div className="flex items-center justify-between">
          <BackgroundColorPicker
            bgColor={bgColor}
            gridColor={gridColor}
            onBgColorChange={onBgColorChange}
            onGridColorChange={onGridColorChange}
          />
          <div className="text-xs md:text-sm text-zd-gray">© 2025 Takazudo Modular</div>
        </div>
      </div>
    </footer>
  );
}
