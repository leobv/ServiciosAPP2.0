import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRemito } from '@/context/RemitoContext';

export default function Paso11() {
  const { remito } = useRemito();

  const [form, setForm] = useState({
    expediente: 'EX-2025-12345678-GCABA-DGPA',
    servicio: '',
    hogares: '',
    montoTotal: '',
    periodo: '',
    mesAprobacion: 'abril de 2025',
  });

  const [texto, setTexto] = useState('');

  useEffect(() => {
    setForm((f) => ({
      ...f,
      servicio: remito.servicio || f.servicio || 'lavandería',
      hogares: remito.hogares || f.hogares || 'San Martín y Rawson',
      montoTotal: remito.monto || f.montoTotal,
      periodo: remito.mes || f.periodo,
    }));
  }, [remito]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const generarTexto = (e) => {
    e.preventDefault();

    const resultado = `
INFORME

En relación al expediente ${form.expediente}, mediante el cual se tramita la contratación del servicio de ${form.servicio} para los hogares ${form.hogares}, correspondiente al período ${form.periodo}, por un monto total de $${form.montoTotal}, se eleva a consideración el proyecto de Acto Administrativo para su aprobación.

Dicho servicio ha sido considerado esencial por esta Dirección General, resultando imprescindible garantizar su continuidad para el correcto funcionamiento de los dispositivos residenciales.

Por lo expuesto, se remite el presente informe con el proyecto de Acto Administrativo adjunto en archivo Word, identificado con el mes de aprobación "${form.mesAprobacion}", a fin de ser evaluado y suscripto por la autoridad competente.`;

    setTexto(resultado);
  };

  return (
    <form className="space-y-4" onSubmit={generarTexto}>
      <Input name="expediente" value={form.expediente} onChange={handleChange} placeholder="Número de expediente" />
      <Input name="servicio" value={form.servicio} onChange={handleChange} placeholder="Servicio" />
      <Input name="hogares" value={form.hogares} onChange={handleChange} placeholder="Hogares" />
      <Input name="montoTotal" value={form.montoTotal} onChange={handleChange} placeholder="Monto total" />
      <Input name="periodo" value={form.periodo} onChange={handleChange} placeholder="Período del servicio" />
      <Input name="mesAprobacion" value={form.mesAprobacion} onChange={handleChange} placeholder="Mes del AA (Ej: abril de 2025)" />

      <Button type="submit">Generar Informe</Button>

      {texto && (
        <Textarea className="mt-4" rows={14} value={texto} readOnly />
      )}
    </form>
  );
}
