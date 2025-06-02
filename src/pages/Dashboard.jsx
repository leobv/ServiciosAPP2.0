import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useCaratula } from '@/context/CaratulaContext';

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

export default function Dashboard() {
  const [selected, setSelected] = useState(null);
  const [visibleTexto, setVisibleTexto] = useState(null);
  const navigate = useNavigate();
  const { caratula } = useCaratula();

  const hogar = caratula?.hogar || '';
  const mes = caratula?.mes || '';
  const expediente = caratula?.expediente || '';

  const clave = (str) => str.toLowerCase().replace(/\s+/g, '');

  const obtenerPasoGuardado = (pasoId) => {
    const key = `paso${pasoId + 1}_${clave(hogar)}_${clave(mes)}`;
    const data = localStorage.getItem(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setSelected(null); // resetear selección si cambia la carátula
  }, [caratula?.hogar, caratula?.mes]);

  if (!hogar || !mes) {
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
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Pasos del trámite actual</h2>

      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded shadow text-sm mb-4">
        <strong>Carátula activa:</strong> {hogar} — {mes.toUpperCase()} — Expediente: {expediente || '—'}
      </div>

      <ul className="space-y-2">
        {pasos.map((paso, i) => {
          const info = obtenerPasoGuardado(i);
          return (
            <li
              key={i}
              className={cn(
                'cursor-pointer px-4 py-2 rounded flex justify-between items-center transition border',
                selected === i ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100 border-gray-200'
              )}
              onClick={() => setSelected(i)}
            >
              <span>{i + 1}. {paso}</span>
              {info?.texto && <span className="text-green-600 font-bold text-sm">✔</span>}
            </li>
          );
        })}
      </ul>

      {selected !== null && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">
              Paso {selected + 1}: {pasos[selected]}
            </h3>

            <div className="flex flex-col md:flex-row gap-2 mt-4">
              <Button onClick={() => navigate(`/paso/${selected + 1}`)}>
                Ir al formulario
              </Button>

              {obtenerPasoGuardado(selected)?.texto && (
                <>
                  <Button variant="outline" onClick={() => setVisibleTexto(obtenerPasoGuardado(selected).texto)}>
                    Ver informe generado
                  </Button>
                  <Button variant="destructive" onClick={() => {
                    const key = `paso${selected + 1}_${clave(hogar)}_${clave(mes)}`;
                    if (confirm(`¿Eliminar el informe del paso ${selected + 1}?`)) {
                      localStorage.removeItem(key);
                      window.location.reload();
                    }
                  }}>
                    Borrar informe
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {visibleTexto && (
        <Dialog open={!!visibleTexto} onOpenChange={() => setVisibleTexto(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Informe generado — {hogar} / {mes.toUpperCase()}</DialogTitle>
            </DialogHeader>
            <Textarea
              value={visibleTexto}
              className="w-full mt-4 text-sm whitespace-pre-wrap"
              readOnly
              rows={24}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
