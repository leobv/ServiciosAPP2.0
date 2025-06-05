// src/components/formularios/Paso3.jsx

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useEmailContext } from '@/context/EmailContext';
import { usePasoKey } from '@/hooks/usePasoKey';
import { useCaratula } from '@/context/CaratulaContext';
import CaratulaActivaBanner from '@/components/CaratulaActivaBanner';

/**
 * Convierte “abril2025” en “ABRIL 2025”
 */
function formatoPeriodo(mes) {
  if (!mes) return '';
  const año = mes.slice(-4);
  const mesTexto = mes.slice(0, mes.length - 4);
  return `${mesTexto.toUpperCase()} ${año}`;
}

/**
 * Calcula una fecha de envío (entre 9 y 11 hs, hace 3 días hábiles antes de fechaStr).
 */
const calcularFechaEnvioPorCorreo = (fechaStr, offsetMinutos = 0) => {
  const fechaLimite = new Date(fechaStr);
  if (isNaN(fechaLimite)) return null;

  let fechaEnvio = new Date(fechaLimite);
  let diasRestar = 3;

  while (diasRestar > 0) {
    fechaEnvio.setDate(fechaEnvio.getDate() - 1);
    const dia = fechaEnvio.getDay();
    if (dia !== 0 && dia !== 6) diasRestar--;
  }

  const hora = 9 + Math.floor(Math.random() * 3); // entre 9 y 11
  const minutos = Math.floor(Math.random() * 60);
  fechaEnvio.setHours(hora, (minutos + offsetMinutos) % 60);

  return fechaEnvio;
};

const empresas = [
  { nombre: 'Lavandería Sanitaria del Sur S.A.', email: 'administracion@lavsanitaria.com.ar' },
  { nombre: 'Industrias Cleantex S.R.L.', email: 'presupuestos@cleantex.com.ar' },
  { nombre: 'Servicios Higiénicos del Plata', email: 'contacto@shplata.com.ar' },
];

export default function Paso3() {
  // Clave específica para Paso 3 (incluye hogar + mes gestionado por useCaratula())
  const STORAGE_KEY = usePasoKey(3);
  const { setUltimaFechaMailPaso3 } = useEmailContext();
  const { caratula } = useCaratula();
  const mes = caratula?.mes || '';

  // ------------- Estado local -------------
  const [form, setForm] = useState({
    fechaLimite: '',
    horaLimite: '15:00',
    periodo: formatoPeriodo(mes), // Inicializa con “ABRIL 2025” si mes === "abril2025"
    numeroPliego: 'PLIEG-2025-XXXXX-GCABA-DGPAPM',
    empresaSeleccionada: '',
  });

  const [emails, setEmails] = useState([]);
  const [texto, setTexto] = useState('');

  // ------------- Carga inicial desde localStorage -------------
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.form) setForm(parsed.form);
        if (parsed.emails) setEmails(parsed.emails);
        if (parsed.texto) setTexto(parsed.texto);
      } catch (err) {
        console.error('Error al cargar datos del Paso 3:', err);
      }
    }
  }, [STORAGE_KEY]);

  // ------------- Manejo de cambios de inputs -------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const copiarAlPortapapeles = (txt) => {
    navigator.clipboard.writeText(txt);
    alert('Contenido copiado al portapapeles');
  };

  // ------------- Generación de Emails y almacenamiento -------------
  const generarEmails = (e) => {
    e.preventDefault();

    // Si se eligió una empresa concreta, solo filtramos esa; si no, enviamos a las tres
    const seleccionadas = form.empresaSeleccionada
      ? empresas.filter((emp) => emp.email === form.empresaSeleccionada)
      : empresas;

    // Genera un array de objetos { para, fecha, cuerpo, fechaObj }
    const nuevosEmails = seleccionadas.map((empresa, index) => {
      const fechaEnvioRaw = calcularFechaEnvioPorCorreo(form.fechaLimite, index * 13);
      const fechaFormateada = fechaEnvioRaw.toLocaleString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const cuerpo = `
SR. ${empresa.nombre.toUpperCase()}:

Tengo el agrado de dirigirme a Usted, en mi carácter de Director General de Políticas Asistenciales para Personas Mayores dependiente de la Subsecretaría de Personas Mayores del Ministerio de Desarrollo Humano y Hábitat del Gobierno de la Ciudad Autónoma de Buenos Aires, a efectos de solicitar tenga a bien remitir una cotización económica en el marco de la contratación de un servicio de lavandería destinado a los Hogares de Residencia para Adultos Mayores “San Martín” y “Rawson”.

A fin de confeccionar el presupuesto oficial del proceso de compra que se propicia, la cotización deberá ser realizada de acuerdo a la información suministrada en el PLIEGO TÉCNICO (${form.numeroPliego}) y deberá ser remitida por este medio con membrete indicando razón social y CUIT de la empresa, y firmada por apoderado o representante con aclaración.

Dicha cotización podrá enviarse hasta el día ${new Date(form.fechaLimite)
        .toLocaleDateString('es-AR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
        .toUpperCase()}, hasta las ${form.horaLimite} hs inclusive. Dicho presupuesto deberá contemplar los servicios de ${form.periodo}.
      `.trim();

      return {
        para: empresa.email,
        fecha: fechaFormateada,
        cuerpo,
        fechaObj: fechaEnvioRaw,
      };
    });

    // Determinar la última fecha (la mayor) de todos los envíos
    const ultima = nuevosEmails.map((e) => e.fechaObj).reduce((a, b) => (a > b ? a : b));
    setUltimaFechaMailPaso3(ultima);

    setEmails(nuevosEmails);

    // Construimos “texto” concatenando cada email
    const textoCompleto = nuevosEmails
      .map((e) => `${e.fecha} – ${e.para}\n\n${e.cuerpo}`)
      .join('\n\n---\n\n');
    setTexto(textoCompleto);

    // Guardamos todo en localStorage
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ form, emails: nuevosEmails, texto: textoCompleto })
    );
  };

  return (
    <form className="space-y-4" onSubmit={generarEmails}>
      {/* Banner que siempre muestra la carátula activa */}
      <CaratulaActivaBanner />

      <Input
        type="date"
        name="fechaLimite"
        onChange={handleChange}
        value={form.fechaLimite}
        required
      />
      <Input
        name="horaLimite"
        placeholder="Horario límite (Ej: 15:00)"
        value={form.horaLimite}
        onChange={handleChange}
        required
      />
      <Input
        name="periodo"
        placeholder="Meses de servicio (Ej: ABRIL 2025)"
        value={form.periodo}
        onChange={handleChange}
        required
      />
      <Input
        name="numeroPliego"
        placeholder="Número del pliego"
        value={form.numeroPliego}
        onChange={handleChange}
        required
      />

      {/* Selector de empresa (opcional) */}
      <Select
        value={form.empresaSeleccionada}
        onValueChange={(value) =>
          setForm((prev) => ({ ...prev, empresaSeleccionada: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar empresa (opcional)" />
        </SelectTrigger>
        <SelectContent>
          {empresas.map((emp) => (
            <SelectItem key={emp.email} value={emp.email}>
              {emp.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit">Generar Email</Button>

      {emails.length > 0 && (
        <div className="mt-6 space-y-8">
          {emails.map((email, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-6 bg-white shadow-sm text-sm space-y-2"
            >
              <div>
                <strong>De:</strong> direccion@buenosaires.gob.ar
              </div>
              <div>
                <strong>Para:</strong> {email.para}
              </div>
              <div>
                <strong>Asunto:</strong> Solicitud de Cotización – Servicio de Lavandería
              </div>
              <div>
                <strong>Fecha:</strong> {email.fecha}
              </div>
              <hr className="my-2" />
              <pre className="whitespace-pre-wrap text-gray-800">{email.cuerpo}</pre>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => copiarAlPortapapeles(email.cuerpo)}
                >
                  Copiar contenido
                </Button>
              </div>
              <hr className="my-2" />
              <div className="text-gray-500 italic">
                Este mensaje es una simulación de envío individual. No será enviado por correo.
              </div>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
