import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './app';
import PanelMaterialPage from './components/panel-material-page';
import ModulesPage from './components/modules-page';
import AppHeader from './components/app-header';
import ErrorBoundary from './components/error-boundary';

function PanelPage() {
  return (
    <div className="h-screen bg-zd-black flex flex-col overflow-hidden">
      <AppHeader selectedCase={null} onCaseSelect={() => {}} />
      <main className="flex-1 overflow-hidden">
        <ErrorBoundary>
          <PanelMaterialPage />
        </ErrorBoundary>
      </main>
    </div>
  );
}

function ModulesDevPage() {
  return (
    <div className="h-screen bg-zd-black flex flex-col overflow-hidden">
      <AppHeader selectedCase={null} onCaseSelect={() => {}} />
      <main className="flex-1 overflow-hidden">
        <ErrorBoundary>
          <ModulesPage />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function AppWithRouting() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/panel" element={<PanelPage />} />
          <Route path="/modules" element={<ModulesDevPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
