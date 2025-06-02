// src/components/formularios/Paso7.jsx

import { useEffect, useState } from 'react';
import { useCaratula } from '@/context/CaratulaContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDate_ddMMyyyy } from '@/lib/formatDate';

export default function Paso7() {
  const { caratula } = useCaratula();
  const hogar = caratula?.hogar || 'Sin hogar';
  const mesTrabajo = caratula?.mes || '';
  const periodoFormateado = mesTrabajo.toUpperCase(); // “MAYO2025” o similar

  // La key en localStorage:
  const STORAGE_KEY = `paso7_${hogar.toLowerCase().replace(/\s+/g, '')}_${mesTrabajo.toLowerCase().replace(/\s+/g, '')}`;

  // Datos básicos:
  const [form, setForm] = useState({
    periodo: periodoFormateado,
    montoSanMartin: '7.700.000',
    montoRawson: '10.000.000',
    montoTotal: '',
    oferta: '17.700.000',
  });
  const [texto, setTexto] = useState('');

  // Al montar, si existe algo guardado lo recuperamos:
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        const parsed = JSON.parse(guardado);
        setForm(parsed.form || form);
        setTexto(parsed.texto || '');
      } catch {
        // Si falla parseo, ignoramos
      }
    } else {
      // Si no hay guardado, precargamos “periodo” desde la carátula
      setForm(prev => ({ ...prev, periodo: periodoFormateado }));
    }
  }, [STORAGE_KEY, periodoFormateado]);

  // Cuando cambie “texto” o “form”, guardamos automáticamente
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
    if (!caratula) {
      alert('Seleccioná primero una carátula en Paso 1.');
      return;
    }

    const fechaCreacion = caratula.fechaBase; // ISO string
    const fechaCorte = formatDate_ddMMyyyy(fechaCreacion);

    const resultado = `
INFORME

En el marco del Decreto N° 433-GCABA-16 y modificatorios, mediante el presente se solicita autorización para proceder a la contratación del servicio de lavandería para los Hogares de Residencia para Adultos Mayores “San Martín” y “Rawson” durante el período ${form.periodo}.

Dicho servicio comprende el lavado, desinfectado, secado, planchado, retiro y entrega de ropa de cama y ropa de cuerpo, conforme a las necesidades de los/as residentes.

Los valores mensuales estimados son:
- Hogar “San Martín”: $${form.montoSanMartin}
- Hogar “Rawson”: $${form.montoRawson}

El monto total estimado para el período es de $${form.montoTotal}.

Oferta más conveniente (Ingale S.R.L.): $${form.oferta}.

Carátula creada el: ${fechaCorte}.

Por lo expuesto, se eleva la presente actuación para su consideración y aprobación.
    `.trim();

    setTexto(resultado);
  };

  const borrarFormulario = () => {
    localStorage.removeItem(STORAGE_KEY);
    setForm({
      periodo: periodoFormateado,
      montoSanMartin: '7.700.000',
      montoRawson: '10.000.000',
      montoTotal: '',
      oferta: '17.700.000',
    });
    setTexto('');
  };

  return (
    <form className="space-y-4" onSubmit={generarTexto}>
      <h2 className="text-lg font-semibold">Paso 7: Informe DG Damiano</h2>

      {!caratula ? (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-yellow-800">
          Primero debés seleccionar una carátula en el Paso 1.
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700">
            <strong>Carátula activa:</strong> {hogar} — {mesTrabajo.toUpperCase()} — Exp: {caratula.expediente}
          </p>

          <Input
            name="periodo"
            value={form.periodo}
            onChange={handleChange}
            placeholder="Período del servicio"
            readOnly
          />
          <Input
            name="montoSanMartin"
            value={form.montoSanMartin}
            onChange={handleChange}
            placeholder="Monto mensual San Martín"
          />
          <Input
            name="montoRawson"
            value={form.montoRawson}
            onChange={handleChange}
            placeholder="Monto mensual Rawson"
          />
          <Input
            name="montoTotal"
            value={form.montoTotal}
            onChange={handleChange}
            placeholder="Monto total período"
          />
          <Input
            name="oferta"
            value={form.oferta}
            onChange={handleChange}
            placeholder="Oferta Ingale S.R.L."
          />

          <div className="flex gap-2">
            <Button type="submit">Generar Informe</Button>
            <Button type="button" variant="destructive" onClick={borrarFormulario}>
              Borrar
            </Button>
          </div>

          {texto && (
            <Textarea className="mt-4" rows={16} value={texto} readOnly />
          )}
        </>
      )}
    </form>
  );
}
