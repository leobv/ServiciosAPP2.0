// src/components/formularios/Paso1.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useCaratula } from '@/context/CaratulaContext';
import { formatDate_ddMMyyyy } from '@/lib/formatDate'; // importamos helper

const hogaresDisponibles = ['San Martín', 'Rawson'];
const mesesDisponibles = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const normalizarForm = (f) => ({
  expediente: f?.expediente || '',
  remito: f?.remito || '',
  monto: f?.monto || '',
  servicio: f?.servicio || '',
  mes: f?.mes || '',
  hogar: f?.hogar || '',
});

export default function Paso1() {
  const navigate = useNavigate();
  const { caratula, seleccionarCaratula, limpiarCaratula } = useCaratula();

  // Si ya hay carátula (seleccionada en contexto), la usamos como base
  const [form, setForm] = useState(() => normalizarForm(caratula || {}));
  const [texto, setTexto] = useState('');
  const [cabecerasGuardadas, setCabecerasGuardadas] = useState([]);

  // Construimos la key para localStorage, igual que antes:
  const claveActual = `cabecera_${form.hogar}_${form.mes}`;

  // Si existe en localStorage, cargamos (y mostramos) la carátula
  useEffect(() => {
    const guardada = localStorage.getItem(claveActual);
    if (guardada) {
      const parsed = JSON.parse(guardada);
      const limpio = normalizarForm(parsed);
      setForm(limpio);

      // Genera texto con la fecha formateada (ejemplo “DD/MM/YYYY”)
      const fechaFormateada = formatDate_ddMMyyyy(parsed.fechaBase);
      setTexto(`
PERIODO DE TRABAJO: ${limpio.mes.toUpperCase()} - HOGAR: ${limpio.hogar}

Código de expediente: ${limpio.expediente}
Número de remito: ${limpio.remito}
Monto total del servicio: $${limpio.monto}
Servicio solicitado: ${limpio.servicio}

Carátula creada el: ${fechaFormateada}
      `.trim());
    }
  }, [claveActual]);

  // Cargar lista de carátulas existentes para seleccionar/editar
  useEffect(() => {
    const todasKeys = Object.keys(localStorage).filter(k => k.startsWith('cabecera_'));
    const cargadas = todasKeys
      .map((k) => {
        try {
          const datos = JSON.parse(localStorage.getItem(k));
          if (datos?.mes && datos?.hogar) return { ...datos, key: k };
        } catch { /* ignoro inválidas */ }
        return null;
      })
      .filter(Boolean);
    setCabecerasGuardadas(cargadas);
  }, [texto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => normalizarForm({ ...prev, [name]: value }));
  };

  const generarTexto = (datos = form, fechaISO = new Date().toISOString()) => {
    const fechaFormateada = formatDate_ddMMyyyy(fechaISO);
    return `
PERIODO DE TRABAJO: ${(datos.mes || '—').toUpperCase()} - HOGAR: ${datos.hogar || '—'}

Código de expediente: ${datos.expediente || '—'}
Número de remito: ${datos.remito || '—'}
Monto total del servicio: $${datos.monto || '—'}
Servicio solicitado: ${datos.servicio || '—'}

Carátula creada el: ${fechaFormateada}
    `.trim();
  };

  const guardar = () => {
    // Validaciones básicas
    if (!form.expediente || !form.remito || !form.monto || !form.servicio) {
      alert('Todos los campos deben estar completos');
      return;
    }
    const limpio = normalizarForm(form);
    const fechaNow = new Date().toISOString();

    // Guardamos en localStorage incluyendo fechaBase
    localStorage.setItem(
      `cabecera_${limpio.hogar}_${limpio.mes}`,
      JSON.stringify({ ...limpio, fechaBase: fechaNow })
    );

    // Actualizamos contexto para que el resto de pasos vean la misma carátula
    seleccionarCaratula({ ...limpio, fechaBase: fechaNow });
    // Actualizamos el texto de vista previa
    setTexto(generarTexto(limpio, fechaNow));
  };

  const borrar = () => {
    localStorage.removeItem(claveActual);
    limpiarCaratula();
    const limpio = normalizarForm({});
    setForm(limpio);
    setTexto('');
  };

  const seleccionarCabecera = (cab) => {
    // Al seleccionar, ponemos esa carátula en contexto y recargamos el formulario
    seleccionarCaratula({
      hogar: cab.hogar,
      mes: cab.mes,
      expediente: cab.expediente,
      servicio: cab.servicio,
      fechaBase: cab.fechaBase,
    });
    setForm(normalizarForm(cab));
    setTexto(generarTexto(normalizarForm(cab), cab.fechaBase));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded shadow text-sm">
        <strong>Carátula activa:</strong> {form.hogar} — {form.mes?.toUpperCase() || '—'} — Expediente: {form.expediente || '—'}
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          guardar();
        }}
      >
        <Input name="expediente" value={form.expediente} onChange={handleChange} placeholder="Código de expediente" />
        <Input name="remito" value={form.remito} onChange={handleChange} placeholder="Número de remito" />
        <Input name="monto" value={form.monto} onChange={handleChange} placeholder="Monto total ($)" />
        <Input name="servicio" value={form.servicio} onChange={handleChange} placeholder="Tipo de servicio (ej: lavandería)" />

        <div className="grid grid-cols-2 gap-4">
          <select name="mes" value={form.mes} onChange={handleChange} className="border rounded p-2">
            {mesesDisponibles.map((m) => (
              <option key={m} value={`${m}2025`}>
                {m.toUpperCase()} 2025
              </option>
            ))}
          </select>
          <select name="hogar" value={form.hogar} onChange={handleChange} className="border rounded p-2">
            {hogaresDisponibles.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button type="submit">Guardar carátula</Button>
          <Button type="button" variant="destructive" onClick={borrar}>Borrar</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>Volver al menú principal</Button>
        </div>

        {texto && <Textarea className="mt-4" value={texto} rows={8} readOnly />}
      </form>

      <hr className="my-6" />

      {/* Carátulas guardadas */}
      <h3 className="text-lg font-semibold">📂 Carátulas guardadas</h3>
      {cabecerasGuardadas.length === 0 ? (
        <p className="text-gray-500 italic">No hay carátulas guardadas aún.</p>
      ) : (
        <div className="grid gap-4">
          {cabecerasGuardadas.map((cab, i) => {
            if (!cab?.mes || !cab?.hogar) return null;
            const isActiva = cab.mes === form.mes && cab.hogar === form.hogar;
            const clave = `cabecera_${cab.hogar}_${cab.mes}`;

            return (
              <Card
                key={i}
                className={cn(
                  'p-4 flex justify-between items-center border',
                  isActiva ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                )}
              >
                <div className="space-y-1">
                  <div className="font-semibold">
                    {cab.hogar} — {cab.mes.toUpperCase()}
                    {isActiva && <span className="ml-2 text-xs text-blue-700">(activa)</span>}
                  </div>
                  <div className="text-sm text-gray-600">
                    Exp: {cab.expediente || '—'} • Fecha: {formatDate_ddMMyyyy(cab.fechaBase)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isActiva && (
                    <Button size="sm" onClick={() => seleccionarCabecera(cab)}>
                      🟢 Usar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setForm(normalizarForm(cab));
                      setTexto(generarTexto(cab, cab.fechaBase));
                    }}
                  >
                    ✏️ Ver/editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm(`¿Eliminar la carátula ${cab.hogar} - ${cab.mes}?`)) {
                        localStorage.removeItem(clave);
                        setCabecerasGuardadas(old =>
                          old.filter(item => item.key !== clave)
                        );
                      }
                    }}
                  >
                    🗑 Eliminar
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
