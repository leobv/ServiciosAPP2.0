// src/components/formularios/Paso3.jsx

import { useState, useEffect } from 'react';
import { useCaratula } from '@/context/CaratulaContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDate_verbose } from '@/lib/formatDate'; // usamos formato “día de mes de año, hh:mm” 

const empresas = [
  { nombre: 'Lavandería Sanitaria del Sur S.A.', email: 'administracion@lavsanitaria.com.ar' },
  { nombre: 'Industrias Cleantex S.R.L.', email: 'presupuestos@cleantex.com.ar' },
  { nombre: 'Servicios Higiénicos del Plata', email: 'contacto@shplata.com.ar' },
];

export default function Paso3() {
  const { caratula } = useCaratula();
  const [form, setForm] = useState({
    fechaLimite: '',      // p.ej. “2025-05-15”
    horaLimite: '15:00',  // p.ej. “15:00”
    empresaSeleccionada: '',
  });
  const [textoEmails, setTextoEmails] = useState('');

  // Si queremos precargar “periodo” desde la carátula:
  // (si la carátula tiene mes = "mayo2025", podemos usarlo aquí)
  useEffect(() => {
    if (caratula?.mes) {
      setForm(prev => ({
        ...prev,
        // opcional: precargar mes en un input de texto (si existiera)
        // periodo: caratula.mes.replace(/(\d+)/, ' $1'), 
      }));
    }
  }, [caratula]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Helper para calcular “3 días hábiles antes”
  const calcularFechaEnvio = (fechaLímiteStr) => {
    const fechaLimite = new Date(fechaLímiteStr);
    if (isNaN(fechaLimite)) return null;

    let fechaEnv = new Date(fechaLimite);
    let dias = 3;
    while (dias > 0) {
      fechaEnv.setDate(fechaEnv.getDate() - 1);
      const day = fechaEnv.getDay();
      if (day !== 0 && day !== 6) dias--;
    }
    // Asignamos hora aleatoria entre 9 y 11
    const hora = 9 + Math.floor(Math.random() * 3);
    const min = Math.floor(Math.random() * 60);
    fechaEnv.setHours(hora, min);
    return fechaEnv;
  };

  const generarEmails = (e) => {
    e.preventDefault();
    if (!caratula) {
      alert('Primero seleccioná una carátula en el Paso 1.');
      return;
    }
    if (!form.fechaLimite) {
      alert('Elegí primero la fecha límite.');
      return;
    }

    const empresasSelec = form.empresaSeleccionada
      ? empresas.filter(e => e.email === form.empresaSeleccionada)
      : empresas;

    // Armamos un array con { para, cuerpo } para cada empresa
    const arrayEmails = empresasSelec.map((empresa, i) => {
      const fechaEnvioObj = calcularFechaEnvio(form.fechaLimite);
      const fechaEnvioTexto = fechaEnvioObj
        ? formatDate_verbose(fechaEnvioObj)
        : 'fecha inválida';

      // El cuerpo del mail con datos de la carátula (misma fechaBase)
      const cuerpo = `
SR. ${empresa.nombre.toUpperCase()}:

Tengo el agrado de dirigirme a Usted en mi carácter de Director General de Políticas Asistenciales para Personas Mayores, a efectos de solicitar tenga a bien remitir una cotización económica en el marco de la contratación del servicio de ${caratula.servicio || 'lavandería'} destinado al hogar “${caratula.hogar}”.

La cotización deberá ser realizada de acuerdo al Pliego Técnico (Expediente N° ${caratula.expediente || '—'}) y deberá ser remitida con membrete, CUIT y firma del representante.

Dicha cotización podrá enviarse hasta el día ${new Date(form.fechaLimite).toLocaleDateString('es-AR')} a las ${form.horaLimite} hs inclusive. El presupuesto debe contemplar el período ${caratula.mes}.

Envío simulado: Fecha de “envío” programada: ${fechaEnvioTexto}.
      `.trim();

      return {
        para: empresa.email,
        cuerpo,
      };
    });

    // Unificamos todo en un solo bloque de texto
    const todos = arrayEmails
      .map((e) => `Para: ${e.para}\n\n${e.cuerpo}`)
      .join('\n\n---\n\n');

    setTextoEmails(todos);
  };

  return (
    <form className="space-y-4" onSubmit={generarEmails}>
      <h2 className="text-lg font-semibold">Paso 3: Invitación a Cotizar</h2>

      {!caratula ? (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-yellow-800">
          Primero debés seleccionar una carátula en el Paso 1.
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700">
            <strong>Carátula activa:</strong> {caratula.hogar} — {caratula.mes} — Exp: {caratula.expediente}
          </p>

          <Input
            type="date"
            name="fechaLimite"
            value={form.fechaLimite}
            onChange={handleChange}
            required
          />
          <Input
            name="horaLimite"
            placeholder="Horario límite (Ej: 15:00)"
            value={form.horaLimite}
            onChange={handleChange}
            required
          />

          <select
            name="empresaSeleccionada"
            value={form.empresaSeleccionada}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Todas las empresas</option>
            {empresas.map((e) => (
              <option key={e.email} value={e.email}>{e.nombre}</option>
            ))}
          </select>

          <Button type="submit">Generar Emails</Button>

          {textoEmails && (
            <div className="mt-4 border rounded p-4 bg-white whitespace-pre-wrap text-sm text-gray-800">
              {textoEmails}
            </div>
          )}
        </>
      )}
    </form>
  );
}
