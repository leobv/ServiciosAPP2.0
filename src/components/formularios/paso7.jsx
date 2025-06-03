import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCabecera } from '@/hooks/useCabecera';

export default function Paso7() {
  const [params] = useSearchParams();
  const { periodo, monto } = useCabecera();

  const hogar = params.get('hogar') || 'SanMartín';
  const mesTrabajo = params.get('mes') || 'abril2025';
  const STORAGE_KEY = `paso7_${hogar}_${mesTrabajo}`;

  const [form, setForm] = useState({
    periodo: periodo || '',
    montoSanMartin: '7.700.000',
    montoRawson: '10.000.000',
    montoTotal: monto || '',
    oferta: '17.700.000',
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
    setForm({ ...form, [name]: value });
  };

  const generarTexto = (e) => {
    e.preventDefault();

    const resultado = `
INFORME

En el marco del Decreto N° 433-GCABA-16 y modificatorios, por medio del presente se solicita autorización para proceder a la contratación del servicio de lavandería para los Hogares de Residencia para Adultos Mayores “San Martín” y “Rawson”, dependientes de esta Dirección General, durante el período ${form.periodo}.

Dicho servicio comprende el lavado, desinfectado, secado, planchado, retiro y entrega de ropa de cama y de cuerpo de los hogares mencionados, conforme a las necesidades de los/as residentes que allí habitan.

Cabe destacar que este servicio es esencial para el correcto funcionamiento de los hogares, ya que permite mantener las condiciones adecuadas de higiene y cuidado de las personas mayores alojadas en los mismos.

Los valores mensuales estimados son los siguientes:
- Hogar “San Martín”: $${form.montoSanMartin}
- Hogar “Rawson”: $${form.montoRawson}

El monto total estimado para el período solicitado es de $${form.montoTotal}.

Asimismo, se deja constancia que la oferta económica más conveniente presentada en el marco del proceso de selección anterior ascendía a $${form.oferta}, correspondiente a la firma Ingale S.R.L.

En virtud de lo expuesto, y considerando que el proveedor ha prestado el servicio en períodos anteriores cumpliendo satisfactoriamente con los requerimientos establecidos, se considera pertinente solicitar la contratación directa del mismo, a fin de garantizar la continuidad del servicio y evitar demoras en su implementación.

Por lo expuesto, se eleva la presente actuación para su consideración y aprobación por parte de la autoridad competente.`;

    setTexto(resultado);
  };

  const borrarFormulario = () => {
    localStorage.removeItem(STORAGE_KEY);
    setForm({
      periodo: periodo || '',
      montoSanMartin: '7.700.000',
      montoRawson: '10.000.000',
      montoTotal: monto || '',
      oferta: '17.700.000',
    });
    setTexto('');
  };

  return (
    <form className="space-y-4" onSubmit={generarTexto}>
      <Input name="periodo" value={form.periodo} onChange={handleChange} placeholder="Periodo del servicio (Ej: abril a junio de 2025)" />
      <Input name="montoSanMartin" value={form.montoSanMartin} onChange={handleChange} placeholder="Monto mensual San Martín" />
      <Input name="montoRawson" value={form.montoRawson} onChange={handleChange} placeholder="Monto mensual Rawson" />
      <Input name="montoTotal" value={form.montoTotal} onChange={handleChange} placeholder="Monto total período" />
      <Input name="oferta" value={form.oferta} onChange={handleChange} placeholder="Monto oferta Ingale S.R.L." />
      <div className="flex gap-2">
        <Button type="submit">Generar Informe</Button>
        <Button type="button" variant="destructive" onClick={borrarFormulario}>Borrar</Button>
      </div>

      {texto && (
        <Textarea className="mt-4" rows={20} value={texto} readOnly />
      )}
    </form>
  );
}
