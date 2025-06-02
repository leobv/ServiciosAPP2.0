import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import CaratulaActivaBanner from '@/components/CaratulaActivaBanner';
import { usePasoKey } from '@/hooks/usePasoKey';

export default function Paso2() {
  const STORAGE_KEY = usePasoKey(2);

  const [form, setForm] = useState({
    servicio: 'lavandería',
    hogares: 'San Martín y Rawson',
    direcciones: 'Av. Warnes 2650 (San Martín), Av. Alcorta 1402 (Rawson)',
    horario: 'lunes a domingos, en el horario de 06:00 a 12:00 hs',
    mesInicio: 'abril de 2025',
    duracion: '3 (tres) meses',
    elementos: 'sábanas, fundas, toallas, repasadores, toallones, cortinas, manteles',
  });

  const [textoGenerado, setTextoGenerado] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.form) setForm(parsed.form);
        if (parsed.texto) setTextoGenerado(parsed.texto);
      } catch (err) {
        console.error('Error cargando datos del Paso 2:', err);
      }
    }
  }, [STORAGE_KEY]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generarTexto = (e) => {
    e.preventDefault();

    const texto = `
PLIEGO DE ESPECIFICACIONES TÉCNICAS

El presente documento tiene por objeto establecer las condiciones técnicas necesarias para la contratación del servicio de ${form.servicio}, con destino a los hogares ${form.hogares}, dependientes de la Dirección General Políticas Asistenciales para Personas Mayores.

Los domicilios de los mencionados hogares son:
${form.direcciones}

El servicio se prestará ${form.horario}, a partir del mes de ${form.mesInicio}, por un período de ${form.duracion}.

Los elementos a tratar serán: ${form.elementos}.

Las tareas incluyen: lavado, desinfectado, secado, planchado, retiro y entrega. El servicio debe garantizar condiciones sanitarias adecuadas y una frecuencia suficiente que asegure el recambio diario necesario para el bienestar de los residentes.
    `.trim();

    setTextoGenerado(texto);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, texto }));
  };

  const borrarFormulario = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTextoGenerado('');
  };

  return (
    <form className="space-y-4" onSubmit={generarTexto}>
      <CaratulaActivaBanner />

      <Input name="servicio" value={form.servicio} placeholder="Tipo de servicio" onChange={handleChange} />
      <Input name="hogares" value={form.hogares} placeholder="Hogares incluidos" onChange={handleChange} />
      <Textarea name="direcciones" value={form.direcciones} placeholder="Direcciones" onChange={handleChange} />
      <Input name="horario" value={form.horario} placeholder="Horario de prestación" onChange={handleChange} />
      <Input name="mesInicio" value={form.mesInicio} placeholder="Mes de inicio (Ej: abril de 2025)" onChange={handleChange} />
      <Input name="duracion" value={form.duracion} placeholder="Duración (Ej: 3 meses)" onChange={handleChange} />
      <Textarea name="elementos" value={form.elementos} placeholder="Elementos a tratar" onChange={handleChange} />

      <div className="flex gap-2">
        <Button type="submit">Generar Texto</Button>
        <Button type="button" variant="destructive" onClick={borrarFormulario}>
          Borrar
        </Button>
      </div>

      {textoGenerado && (
        <Textarea className="mt-4" rows={16} value={textoGenerado} readOnly />
      )}
    </form>
  );
}
