import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRemito } from '@/context/RemitoContext';

export default function Paso12() {
  const { remito } = useRemito();

  const [form, setForm] = useState({
    proveedor: '',
    servicio: '',
    hogares: '',
    periodo: '',
    montoTotal: '',
  });

  const [texto, setTexto] = useState('');

  useEffect(() => {
    setForm((f) => ({
      ...f,
      proveedor: remito.proveedor || f.proveedor || 'Ingale S.R.L.',
      servicio: remito.servicio || f.servicio || 'lavandería',
      hogares: remito.hogares || f.hogares || 'San Martín y Rawson',
      periodo: remito.mes || f.periodo,
      montoTotal: remito.monto || f.montoTotal,
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

Se deja constancia que la firma ${form.proveedor} ha prestado el servicio de ${form.servicio} en los Hogares de Residencia para Adultos Mayores ${form.hogares}, conforme a lo estipulado contractualmente, durante el período ${form.periodo}.

El servicio ha sido realizado de manera satisfactoria, cumpliendo con los requerimientos técnicos y operativos establecidos.

El monto total correspondiente a la prestación efectuada asciende a $${form.montoTotal}.

En virtud de lo expuesto, se eleva la presente actuación a la Subsecretaría de Personas Mayores a los efectos de continuar con el trámite de aprobación del gasto y su correspondiente afectación presupuestaria.`;

    setTexto(resultado);
  };

  return (
    <form className="space-y-4" onSubmit={generarTexto}>
      <Input name="proveedor" value={form.proveedor} onChange={handleChange} placeholder="Proveedor" />
      <Input name="servicio" value={form.servicio} onChange={handleChange} placeholder="Servicio" />
      <Input name="hogares" value={form.hogares} onChange={handleChange} placeholder="Hogares" />
      <Input name="periodo" value={form.periodo} onChange={handleChange} placeholder="Período de prestación" />
      <Input name="montoTotal" value={form.montoTotal} onChange={handleChange} placeholder="Monto total reconocido" />

      <Button type="submit">Generar Informe</Button>

      {texto && (
        <Textarea className="mt-4" rows={14} value={texto} readOnly />
      )}
    </form>
  );
}
