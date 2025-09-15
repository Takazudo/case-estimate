import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './app';
import PanelMaterialPage from './components/panel-material-page';
import AppHeader from './components/app-header';

function PanelPage() {
  return (
    <div className="h-screen bg-zd-black flex flex-col overflow-hidden">
      <AppHeader selectedCase={null} onCaseSelect={() => {}} />
      <main className="flex-1 overflow-hidden">
        <PanelMaterialPage />
      </main>
    </div>
  );
}

export default function AppWithRouting() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/panel" element={<PanelPage />} />
      </Routes>
    </Router>
  );
}
