import { cases } from '../data/cases';

interface CustomColorPreviewProps {
  caseType: string;
  panelColors: { [key: string]: string };
  selectedPanel: string | null;
  onPanelSelect: (panelId: string) => void;
}

const CustomColorPreview = ({
  caseType,
  panelColors,
  selectedPanel,
  onPanelSelect,
}: CustomColorPreviewProps) => {
  const currentCase = cases[caseType];
  if (!currentCase) return null;

  return (
    <div className="px-hgap-sm lg:px-hgap-md py-vgap-xs bg-zd-black">
      <div className="flex">
        {currentCase.panels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => onPanelSelect(panel.id)}
            className={`
              flex-1 h-12 border transition-all
              ml-[2px] first:ml-0
              relative active:z-10 focus:z-10
              ${
                selectedPanel === panel.id
                  ? 'border-zd-link border-2 shadow-lg'
                  : 'border-zd-gray hover:border-zd-link'
              }
            `}
            style={{ backgroundColor: panelColors[panel.id] || '#1f2937' }}
            title={panel.name}
            aria-label={`Select ${panel.name}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomColorPreview;
