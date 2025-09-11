import AllInOneSVG from './all-in-one-svg';
import { generateBackgroundPattern } from '../utils/panel-colors';

interface VisualizationPanelProps {
  selectedCase: string | null;
  panelColors: { [key: string]: string };
  onPanelClick: (panelId: string) => void;
  selectedPanel: string | null;
  material: 'acrylic' | '3dp' | undefined;
  bgColor: string;
  gridColor: string;
}

export default function VisualizationPanel({
  selectedCase,
  panelColors,
  onPanelClick,
  selectedPanel,
  material,
  bgColor,
  gridColor,
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
          <AllInOneSVG
            caseType={selectedCase}
            panelColors={panelColors}
            onPanelClick={onPanelClick}
            selectedPanel={selectedPanel}
            material={material}
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
