// layouts/MainLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen">
      <ScrollArea className="border-r p-4 bg-gray-50">
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
              )}
            >
              {i + 1}. {paso}
            </li>
          ))}
        </ul>

        <hr className="my-4" />
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          Ir al Dashboard
        </Button>
      </ScrollArea>

      <div className="col-span-1 md:col-span-3 p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
