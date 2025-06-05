// layouts/MainLayout.jsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useCaratula } from '@/context/CaratulaContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const pasos = [
  'Carátula', 'PET', 'Invitación a cotizar', 'RIUPP', 'Presupuestos',
  'Constancia AFIP', 'Informe DG', 'Respuesta SUBSE'
];

export default function MainLayout() {
  const { caratula } = useCaratula();
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.pathname.match(/^\/paso\/(\d+)/);
  const activePaso = match ? parseInt(match[1], 10) : null;
  const progress = activePaso ? ((activePaso - 1) / pasos.length) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
        <h1 className="font-semibold">Generador de Informes GCBA</h1>
        <Button variant="ghost" className="text-white hover:bg-gray-700" onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>
      </header>
      <div className="flex flex-1">
        <ScrollArea className="w-64 border-r p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Pasos del proceso</h2>

        {caratula ? (
          <div className="text-sm bg-blue-100 text-blue-800 p-2 mb-4 rounded">
            <strong>{caratula.hogar}</strong> – {caratula.mes.toUpperCase()}<br />
            Expediente: {caratula.expediente}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic mb-4">Seleccioná una carátula</p>
        )}

        <ul className="space-y-2">
          {pasos.map((paso, i) => (
            <li
              key={i}
              onClick={() => navigate(`/paso/${i + 1}`)}
              className={cn(
                'cursor-pointer px-3 py-2 rounded hover:bg-gray-200 transition',
                activePaso === i + 1 && 'bg-blue-200 font-semibold'
              )}
            >
              {i + 1}. {paso}
            </li>
          ))}
        </ul>

        {activePaso && (
          <div className="mt-6">
            <div className="text-xs mb-1 text-gray-700">
              Progreso {activePaso}/{pasos.length}
            </div>
            <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <hr className="my-4" />
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          Ir al Dashboard
        </Button>
      </ScrollArea>

      <div className="col-span-1 md:col-span-3 p-4 overflow-y-auto">
        <Outlet />
      </div>
      </div>
    </div>
  );
}
