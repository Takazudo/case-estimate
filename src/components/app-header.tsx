import HeaderCaseSelector from './header-case-selector';

interface AppHeaderProps {
  selectedCase: string | null;
  onCaseSelect: (caseType: string) => void;
}

export default function AppHeader({ selectedCase, onCaseSelect }: AppHeaderProps) {
  return (
    <header className="bg-zd-gray2 border-b border-zd-gray shadow-sm flex-shrink-0">
      <div className="px-hgap-sm py-vgap-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-base md:text-xl text-zd-white flex items-center gap-hgap-xs">
            <img
              src="/takazudo-logo.svg"
              alt="Takazudo Logo"
              className="w-12 h-12 brightness-0 invert mr-[4px]"
            />
            Takazudo Modular Panels
          </h1>
          <div className="flex items-center gap-hgap-xs">
            <HeaderCaseSelector selectedCase={selectedCase} onCaseSelect={onCaseSelect} />
          </div>
        </div>
      </div>
    </header>
  );
}
