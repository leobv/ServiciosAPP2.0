import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useCaratula } from '@/context/CaratulaContext';
import { cn } from '@/lib/utils';

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
  mes: f?.mes || 'abril2025',
  hogar: f?.hogar || 'San Martín',
});

export default function Paso1() {
  const navigate = useNavigate();
  const { caratula, setCaratula } = useCaratula();
  const [form, setForm] = useState(() => normalizarForm(caratula));
  const [texto, setTexto] = useState('');
  const [cabecerasGuardadas, setCabecerasGuardadas] = useState([]);
  const [irADashboard, setIrADashboard] = useState(false);

  const claveActual = `cabecera_${form.hogar}_${form.mes}`;

  useEffect(() => {
    const saved = localStorage.getItem(claveActual);
    if (saved) {
      const parsed = JSON.parse(saved);
      const limpio = normalizarForm(parsed);
      setForm(limpio);
      setTexto(generarTexto(limpio));
    }
  }, [claveActual]);

  useEffect(() => {
    cargarCaratulasValidas();
  }, []);

  useEffect(() => {
    if (irADashboard) {
      navigate('/dashboard');
    }
  }, [irADashboard]);

  const cargarCaratulasValidas = () => {
    const claves = Object.keys(localStorage).filter(k => k.startsWith('cabecera_'));
    const cargadas = claves.map(k => {
      try {
        const data = JSON.parse(localStorage.getItem(k));
        return data?.mes && data?.hogar ? { ...data, key: k } : null;
      } catch {
        return null;
      }
    }).filter(Boolean);
    setCabecerasGuardadas(cargadas);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => normalizarForm({ ...prev, [name]: value }));
  };

  const generarTexto = (datos = form) => `
PERIODO DE TRABAJO: ${(datos.mes || '—').toUpperCase()} - HOGAR: ${datos.hogar || '—'}

Código de expediente: ${datos.expediente || '—'}
Número de remito: ${datos.remito || '—'}
Monto total del servicio: $${datos.monto || '—'}
Servicio solicitado: ${datos.servicio || '—'}
`.trim();

  const guardar = () => {
    const camposFaltantes = ['expediente', 'remito', 'monto', 'servicio'].filter(k => !form[k]);
    if (camposFaltantes.length > 0) {
      alert(`Faltan completar los siguientes campos: ${camposFaltantes.join(', ')}`);
      return;
    }

    const limpio = normalizarForm(form);
    const clave = `cabecera_${limpio.hogar}_${limpio.mes}`;
    const yaExiste = localStorage.getItem(clave);

    if (yaExiste) {
      const confirmar = confirm(`Ya existe una carátula para ${limpio.hogar} - ${limpio.mes.toUpperCase()}. ¿Deseás sobrescribirla?`);
      if (!confirmar) return;
    }

    localStorage.setItem(clave, JSON.stringify(limpio));
    setCaratula(limpio);
    setTexto(generarTexto(limpio));
    cargarCaratulasValidas();
    setIrADashboard(true); // ✅ diferido
  };

  const borrar = () => {
    localStorage.removeItem(claveActual);
    const limpio = normalizarForm(null);
    setForm(limpio);
    setTexto('');
    setCaratula(limpio);
    cargarCaratulasValidas();
  };

  const seleccionarCabecera = (cab) => {
    const limpio = normalizarForm(cab);
    setForm(limpio);
    setTexto(generarTexto(limpio));
    setCaratula(limpio);
  };

  const limpiarCaratulasInvalidas = () => {
    const claves = Object.keys(localStorage).filter(k => k.startsWith('cabecera_'));
    let eliminadas = 0;

    claves.forEach(k => {
      try {
        const data = JSON.parse(localStorage.getItem(k));
        if (!data?.mes || !data?.hogar) {
          localStorage.removeItem(k);
          eliminadas++;
        }
      } catch {
        localStorage.removeItem(k);
        eliminadas++;
      }
    });

    if (eliminadas > 0) {
      alert(`${eliminadas} carátulas inválidas fueron eliminadas.`);
      cargarCaratulasValidas();
    } else {
      alert('No se encontraron carátulas inválidas.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded shadow text-sm">
        <strong>Carátula activa:</strong> {form.hogar} — {form.mes?.toUpperCase() || '—'} — Expediente: {form.expediente || '—'}
      </div>

      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        guardar();
      }}>
        <Input name="expediente" value={form.expediente} onChange={handleChange} placeholder="Código de expediente" />
        <Input name="remito" value={form.remito} onChange={handleChange} placeholder="Número de remito" />
        <Input name="monto" value={form.monto} onChange={handleChange} placeholder="Monto total ($)" />
        <Input name="servicio" value={form.servicio} onChange={handleChange} placeholder="Tipo de servicio (ej: lavandería)" />

        <div className="grid grid-cols-2 gap-4">
          <select name="mes" value={form.mes} onChange={handleChange} className="border rounded p-2">
            {mesesDisponibles.map((m) => (
              <option key={m} value={`${m}2025`}>{m.toUpperCase()} 2025</option>
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
          <Button type="button" variant="ghost" onClick={limpiarCaratulasInvalidas}>🧹 Limpiar inválidas</Button>
        </div>

        {texto && <Textarea className="mt-4" value={texto} rows={8} readOnly />}
      </form>

      <hr className="my-6" />
      <h3 className="text-lg font-semibold">📂 Carátulas guardadas</h3>

      {cabecerasGuardadas.length === 0 ? (
        <p className="text-gray-500 italic">No hay carátulas guardadas aún.</p>
      ) : (
        <div className="grid gap-4">
          {cabecerasGuardadas.map((cab, i) => {
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
                  <div className="text-sm text-gray-600">Expediente: {cab.expediente || '—'}</div>
                </div>
                <div className="flex gap-2">
                  {!isActiva && (
                    <Button size="sm" onClick={() => seleccionarCabecera(cab)}>
                      🟢 Usar
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => {
                    setForm(normalizarForm(cab));
                    setTexto(generarTexto(cab));
                  }}>
                    ✏️ Ver/editar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => {
                    if (confirm(`¿Eliminar la carátula ${cab.hogar} - ${cab.mes}?`)) {
                      localStorage.removeItem(clave);
                      cargarCaratulasValidas();
                    }
                  }}>
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
