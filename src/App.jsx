import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCaratula } from './context/CaratulaContext';
import './App.css';

import Paso from './components/pages/paso';
import Dashboard from './components/pages/Dashboard';
import MainLayout from './components/pages/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          {/* Redirección inicial */}
          <Route path="/" element={<RedirectSegunCaratula />} />

          {/* Todo el contenido visible va dentro del layout */}
          <Route element={<MainLayout />}>
            <Route path="/paso/:numero" element={<Paso />} />
            <Route path="/dashboard" element={<DashboardWrapper />} />
          </Route>

          {/* Cualquier ruta inválida también redirige */}
          <Route path="*" element={<RedirectSegunCaratula />} />
        </Routes>
      </BrowserRouter>
  );
}

// Componente auxiliar: redirige al dashboard si hay carátula, o a paso 1
function RedirectSegunCaratula() {
  const last = localStorage.getItem('caratula_activa');
  const caratula = last ? JSON.parse(last) : null;
  return <Navigate to={caratula ? "/dashboard" : "/paso/1"} replace />;
}

// Wrapper que re-renderiza Dashboard cuando cambia la carátula activa
function DashboardWrapper() {
  const { caratula } = useCaratula();
  const key = `${caratula?.hogar || 'x'}-${caratula?.mes || 'x'}`;
  return <Dashboard key={key} />;
}

export default App;
