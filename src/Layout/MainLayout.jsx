import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EmailProvider } from '@/context/EmailContext';
import { RemitoProvider } from '@/context/RemitoContext';
import { useCaratula } from '@/context/CaratulaContext';
import CaratulaActivaBanner from '@/components/CaratulaActivaBanner';

const pasos = [
  'Carátula', 'PET', 'Invitación a cotizar', 'RIUPP', 'Presupuestos',
  'Constancias de AFIP', 'Informe o nota DG', 'Respuesta SUBSE',
  'Inicio de Actividades', 'Remito', 'IF del Proyecto de AA',
  'Informe DG Reconocimiento', 'Conocimiento de la Subse',
  'Pase a SGO COMPRAS', 'Actualización RUIPP', 'Solicitud de Gasto',
  'Informe SGO COMPRAS', 'Aprobación del Gasto', 'Aprobación del AA',
  'Notificación del AA', 'Pase a SGO COMPRAS', 'Afectación Definitiva',
  'Orden de Compra', 'Parte de Recepción Definitiva', 'Devolución a la DG',
  'Repetición desde punto 10'
];

export default function MainLayout() {
  const navigate = useNavigate();
  const { caratula } = useCaratula();
  const [completados, setCompletados] = useState([]);

  useEffect(() => {
    if (!caratula) return;
    const { hogar, mes } = caratula;
    const clave = (str) => str.toLowerCase().replace(/\s+/g, '');

    const pasosCompletos = pasos.map((_, i) => {
      const keys = Object.keys(localStorage);
      return keys.some((k) =>
        k.toLowerCase().startsWith(`paso${i + 1}_`) &&
        k.toLowerCase().includes(clave(hogar)) &&
        k.toLowerCase().includes(clave(mes))
      );
    });
    setCompletados(pasosCompletos);
  }, [caratula]);

  const enPaso1 = window.location.pathname.includes('/paso/1');

  if ((!caratula?.hogar || !caratula?.mes) && !enPaso1) {
    return (
      <div className="p-10 text-center space-y-6">
        <h2 className="text-xl font-semibold text-gray-700">
          No hay una carátula activa seleccionada
        </h2>
        <p className="text-gray-500">Debés crear o activar una carátula en el Paso 1 antes de continuar.</p>
        <Button onClick={() => navigate('/paso/1')}>Ir a Paso 1</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen">
      {/* Menú lateral */}
      <ScrollArea className="border-r bg-gray-50 p-4">
        <h2 className="text-xl font-semibold mb-4">Pasos del proceso</h2>

        {caratula?.hogar && caratula?.mes && <CaratulaActivaBanner />}

        <ul className="space-y-2">
          {pasos.map((paso, i) => (
            <li
              key={i}
              className={cn(
                'cursor-pointer px-3 py-2 rounded flex justify-between items-center transition',
                window.location.pathname.includes(`/paso/${i + 1}`)
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200'
              )}
              onClick={() => navigate(`/paso/${i + 1}`)}
            >
              <span>{i + 1}. {paso}</span>
              {completados[i] && <span className="text-green-600 font-bold text-sm">✔</span>}
            </li>
          ))}
        </ul>

        <hr className="my-4" />

        <div className="space-y-2">
          <Button variant="default" onClick={() => navigate('/dashboard')} className="w-full">
            📊 Ir al Dashboard
          </Button>
        </div>
      </ScrollArea>

      {/* Contenido del paso */}
      <div className="col-span-1 md:col-span-3 p-4 overflow-auto">
        <RemitoProvider>
          <EmailProvider>
            <Outlet />
          </EmailProvider>
        </RemitoProvider>
      </div>
    </div>
  );
}
