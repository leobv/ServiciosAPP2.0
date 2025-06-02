import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEmailContext } from '@/context/EmailContext';
import { useCabecera } from '@/hooks/useCabecera';
import { useSearchParams } from 'react-router-dom';

const calcularDiaHabilPosterior = (fechaBase) => {
  const fecha = new Date(fechaBase);
  while (true) {
    fecha.setDate(fecha.getDate() + 1);
    const dia = fecha.getDay();
    if (dia !== 0 && dia !== 6) break;
  }
  const hora = 9 + Math.floor(Math.random() * 3);
  const minutos = Math.floor(Math.random() * 60);
  fecha.setHours(hora, minutos);
  return fecha.toLocaleString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export default function Paso9() {
  const [params] = useSearchParams();
  const { ultimaFechaMailPaso3 } = useEmailContext();
  const { periodo } = useCabecera();
  const hogar = params.get('hogar') || 'SanMartín';
  const STORAGE_KEY = `paso9_${hogar}_${periodo}`;

  const [form, setForm] = useState({
    proveedor: 'Ingale S.R.L.',
    servicio: 'lavandería',
    hogares: 'San Martín y Rawson',
    fechaInicio: '2025-04-01',
    periodo: periodo || '',
  });

  const [texto, setTexto] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setForm(parsed.form || form);
      setTexto(parsed.texto || '');
    }
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (texto) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, texto }));
    }
  }, [form, texto, STORAGE_KEY]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const generarTexto = (e) => {
    e.preventDefault();

    const fechaMail = ultimaFechaMailPaso3
      ? calcularDiaHabilPosterior(ultimaFechaMailPaso3)
      : 'Fecha no disponible';

    const cuerpo = `
De: direccion@buenosaires.gob.ar
Para: contacto@${form.proveedor.toLowerCase().replace(/\s+/g, '')}.com.ar
Asunto: Notificación de Inicio de Actividades
Fecha: ${fechaMail}

Nos dirigimos a usted a fin de notificarle que, habiendo sido adjudicada la contratación del servicio de ${form.servicio} para los hogares ${form.hogares}, deberá dar inicio a las tareas correspondientes a partir del día ${new Date(form.fechaInicio).toLocaleDateString('es-AR')}. 

El servicio deberá prestarse de acuerdo a lo estipulado en los términos del pliego técnico, durante el período ${form.periodo}.

Sin otro particular, saludamos atentamente.

Dirección General de Políticas Asistenciales para Personas Mayores.
    `.trim();

    setTexto(cuerpo);
  };

  return (
    <form className="space-y-4" onSubmit={generarTexto}>
      <Input name="proveedor" value={form.proveedor} onChange={handleChange} placeholder="Proveedor (Ej: Ingale S.R.L.)" />
      <Input name="servicio" value={form.servicio} onChange={handleChange} placeholder="Servicio (Ej: lavandería)" />
      <Input name="hogares" value={form.hogares} onChange={handleChange} placeholder="Hogares (Ej: San Martín y Rawson)" />
      <Input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} />
      <Input name="periodo" value={form.periodo} onChange={handleChange} placeholder="Período" />

      <Button type="submit">Generar Email</Button>

      {texto && (
        <pre className="whitespace-pre-wrap mt-4 bg-white p-4 rounded border text-sm text-gray-800">
          {texto}
        </pre>
      )}
    </form>
  );
}
