import { useNavigate, useLocation } from 'react-router-dom';
import HeaderCaseSelector from './header-case-selector';

interface AppHeaderProps {
  selectedCase: string | null;
  onCaseSelect: (caseType: string) => void;
}

export default function AppHeader({ selectedCase, onCaseSelect }: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnPanelPage = location.pathname === '/panel';

  const handleLogoClick = () => {
    if (isOnPanelPage) {
      navigate('/');
    } else {
      // Clear the case selection and go to initial page
      onCaseSelect('');
      // Also clear URL parameters
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  return (
    <header className="bg-zd-gray2 border-b border-zd-gray shadow-sm flex-shrink-0">
      <div className="px-hgap-sm py-vgap-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLogoClick}
            className="text-base md:text-xl text-zd-white flex items-center gap-hgap-xs hover:opacity-80 transition-opacity"
            aria-label="Go to home"
          >
            <img
              src="/takazudo-logo.svg"
              alt="Takazudo Logo"
              className="w-12 h-12 brightness-0 invert mr-[4px]"
            />
            Takazudo Modular Panels
          </button>
          <div className="flex items-center gap-hgap-xs">
            {!isOnPanelPage && (
              <button
                onClick={() => navigate('/panel')}
                className="px-4 py-2 text-sm text-zd-white hover:bg-zd-gray hover:bg-opacity-20 rounded transition-colors"
              >
                Panel Materials
              </button>
            )}
            {!isOnPanelPage && (
              <HeaderCaseSelector selectedCase={selectedCase} onCaseSelect={onCaseSelect} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
