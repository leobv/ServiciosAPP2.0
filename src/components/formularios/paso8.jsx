import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCabecera } from '@/hooks/useCabecera';

export default function Paso8() {
  const [params] = useSearchParams();
  const { expediente, periodo, hogar } = useCabecera();
  const STORAGE_KEY = `paso8_${hogar}_${periodo}`;

  const [form, setForm] = useState({
    expediente: expediente || '',
    servicio: '',
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generarTexto = (e) => {
    e.preventDefault();

    const resultado = `
NOTA

En relación al expediente ${form.expediente}, mediante el cual la Dirección General de Políticas Asistenciales para Personas Mayores solicita autorización para la contratación del ${form.servicio}, correspondiente al período ${form.periodo}, se deja constancia que esta Subsecretaría toma conocimiento de lo actuado y presta conformidad para la prosecución del trámite administrativo pertinente.

Se remite a los fines de su prosecución.
    `.trim();

    setTexto(resultado);
  };

  return (
    <form className="space-y-4" onSubmit={generarTexto}>
      <Input
        name="expediente"
        value={form.expediente}
        onChange={handleChange}
        placeholder="Código de expediente"
      />
      <Input
        name="servicio"
        value={form.servicio}
        onChange={handleChange}
        placeholder="Tipo de servicio"
      />
      <Input
        name="periodo"
        value={form.periodo}
        onChange={handleChange}
        placeholder="Período (Ej: abril a junio de 2025)"
      />

      <Button type="submit">Generar Nota</Button>

      {texto && (
        <Textarea className="mt-4" rows={10} value={texto} readOnly />
      )}
    </form>
  );
}
