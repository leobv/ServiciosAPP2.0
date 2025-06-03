import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePasoKey } from '@/hooks/usePasoKey';
import { useCabecera } from '@/hooks/useCabecera';
import CaratulaActivaBanner from '@/components/CaratulaActivaBanner';
import PresupuestoPdfRichard from '@/components/PresupuestoPdfRichard';

const empresas = [
  { nombre: 'Lavadero Richard', fondo: '/20250411_130047.jpg' },
  // ... más empresas si es necesario
];

export default function Paso5() {
  const STORAGE_KEY = usePasoKey(5);
  console.log('📌 Paso5: STORAGE_KEY =', STORAGE_KEY);
  console.log('📌 Paso5: antes de montar, localStorage:', localStorage.getItem(STORAGE_KEY));

  const { periodo: periodoContext } = useCabecera();

  const [form, setForm] = useState({
    fecha: '',
    periodo: periodoContext || '',
    empresa: empresas[0].nombre,
  });
  const [texto, setTexto] = useState('');
  const [mostrarPDF, setMostrarPDF] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log('📌 Paso5 useEffect carga:', saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.form) setForm(parsed.form);
        if (parsed.texto) setTexto(parsed.texto);
      } catch (err) {
        console.error('Error cargando Paso5:', err);
      }
    }
  }, [STORAGE_KEY]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generarInforme = (e) => {
    e.preventDefault();

    const generated = `
BUENOS AIRES, ${form.fecha}

Dirección General Políticas Asistenciales para Personas Mayores
De mi consideración:

Según su pedido, enviamos cotización por el servicio de lavado, planchado, retiro y entrega
de ropa de cama y ropa de cuerpo, con un servicio diario.

El servicio tiene un valor total para el mes de ${form.periodo}, para los hogares que
se detallan según su solicitud:

- Hogar San Martín: $12.925.000
- Hogar Rawson: $10.975.000

Monto final cotizado para el mes de ${form.periodo}:
Pesos Veintitrés Millones Novecientos Mil ($23.900.000).

Sin otro particular, saludo a usted atentamente.
    `.trim();

    setTexto(generated);
    const payload = { form, texto: generated };
    console.log('📌 Paso5 guardar payload:', payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    console.log('📌 Paso5 después de guardar, localStorage:', localStorage.getItem(STORAGE_KEY));
  };

  const borrarInforme = () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('📌 Paso5 tras borrar, localStorage:', localStorage.getItem(STORAGE_KEY));
    setForm({ fecha: '', periodo: periodoContext || '', empresa: empresas[0].nombre });
    setTexto('');
    setMostrarPDF(false);
  };

  const fondo = empresas.find((e) => e.nombre === form.empresa)?.fondo;

  return (
    <form onSubmit={generarInforme} className="space-y-6">
      <CaratulaActivaBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          placeholder="Fecha (Ej: 30/12/2024)"
        />
        <Input
          name="periodo"
          value={form.periodo}
          onChange={handleChange}
          placeholder="Periodo (Ej: ENERO 2025)"
        />
        <select
          name="empresa"
          value={form.empresa}
          onChange={handleChange}
          className="border rounded p-2 col-span-2"
        >
          {empresas.map((e) => (
            <option key={e.nombre} value={e.nombre}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Generar Informe</Button>
        <Button variant="destructive" type="button" onClick={borrarInforme}>
          Borrar Informe
        </Button>
      </div>

      {texto && (
        <>
          <Textarea
            className="border rounded p-4 bg-white whitespace-pre-wrap text-sm leading-relaxed"
            value={texto}
            readOnly
            rows={12}
          />
          <Button
            variant="secondary"
            onClick={() => setMostrarPDF(true)}
            disabled={!fondo}
          >
            Descargar PDF con membrete
          </Button>
        </>
      )}

      {mostrarPDF && fondo && (
        <PresupuestoPdfRichard texto={texto} fondo={fondo} />
      )}
    </form>
  );
}
