import CaseVisualizer from './case-visualizer';
import { generateBackgroundPattern } from '../utils/panel-colors';

interface VisualizationPanelProps {
  selectedCase: string | null;
  panelColors: { [key: string]: string };
  panelColorIds?: { [key: string]: string };
  onPanelClick: (panelId: string) => void;
  selectedPanel: string | null;
  material: 'acrylic' | '3dp' | undefined;
  bgColor: string;
  gridColor: string;
  onLoadingChange?: (isLoading: boolean) => void;
}

export default function VisualizationPanel({
  selectedCase,
  panelColors,
  panelColorIds,
  onPanelClick,
  selectedPanel,
  material,
  bgColor,
  gridColor,
  onLoadingChange,
}: VisualizationPanelProps) {
  return (
    <div
      className="relative border-r border-zd-gray overflow-hidden"
      style={{
        backgroundImage: `url("${generateBackgroundPattern(bgColor, gridColor)}")`,
        backgroundSize: '60px 60px',
        backgroundPosition: 'center',
      }}
    >
      <div className="h-full p-[10px] md:p-[15px] lg:p-[20px] xl:p-[30px] flex items-center justify-center">
        {selectedCase ? (
          <CaseVisualizer
            caseType={selectedCase}
            panelColors={panelColors}
            panelColorIds={panelColorIds}
            onPanelClick={onPanelClick}
            selectedPanel={selectedPanel}
            material={material}
            onLoadingChange={onLoadingChange}
          />
        ) : (
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-zd-white mb-4">Welcome to Takazudo Modular</h2>
            <p className="text-lg text-zd-gray mb-8">
              Design your custom modular synthesizer case with our interactive configurator.
            </p>
            <p className="text-zd-gray">
              Select a case model from the dropdown above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
