import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRemito } from '@/context/RemitoContext';

export default function Paso10() {
  const { setRemito } = useRemito();

  const [form, setForm] = useState({
    proveedor: 'Ingale S.R.L.',
    servicio: 'lavandería',
    hogares: 'San Martín y Rawson',
    mes: 'abril 2025',
    monto: '17.700.000',
  });

  const [texto, setTexto] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const generarRemito = (e) => {
    e.preventDefault();

    setRemito({
      proveedor: form.proveedor,
      mes: form.mes,
      monto: form.monto,
      hogares: form.hogares,
    });

    const textoFinal = `
REMITO VALORIZADO

Proveedor: ${form.proveedor}
Servicio: ${form.servicio}
Hogares: ${form.hogares}
Mes del servicio: ${form.mes}
Monto facturado: $${form.monto}

Conforme:
Firma y Aclaración
Responsable GCABA
    `.trim();

    setTexto(textoFinal);
  };

  return (
    <form className="space-y-4" onSubmit={generarRemito}>
      <Input name="proveedor" value={form.proveedor} onChange={handleChange} placeholder="Proveedor" />
      <Input name="servicio" value={form.servicio} onChange={handleChange} placeholder="Servicio prestado" />
      <Input name="hogares" value={form.hogares} onChange={handleChange} placeholder="Hogares incluidos" />
      <Input name="mes" value={form.mes} onChange={handleChange} placeholder="Mes del servicio" />
      <Input name="monto" value={form.monto} onChange={handleChange} placeholder="Monto facturado" />
      <Button type="submit">Generar Remito</Button>

      {texto && (
        <Textarea className="mt-4" rows={10} value={texto} readOnly />
      )}
    </form>
  );
}