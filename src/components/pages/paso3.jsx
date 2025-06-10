// src/components/formularios/Paso3.jsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useEmailContext } from "@/context/EmailContext";
// ← ahora usamos useCaratula en lugar de useCabecera:
import { useCaratula } from "@/context/CaratulaContext";
import { usePasoKey } from "@/hooks/usePasoKey";
import CaratulaActivaBanner from "@/components/CaratulaActivaBanner";
import { Textarea } from "@/components/ui/textarea";

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
  const hora = 9 + Math.floor(Math.random() * 3);
  const minutos = Math.floor(Math.random() * 60);
  fechaEnvio.setHours(hora, (minutos + offsetMinutos) % 60);
  return fechaEnvio;
};

const empresas = [
  {
    nombre: "Lavandería Sanitaria del Sur S.A.",
    email: "administracion@lavsanitaria.com.ar",
  },
  {
    nombre: "Industrias Cleantex S.R.L.",
    email: "presupuestos@cleantex.com.ar",
  },
  {
    nombre: "Servicios Higiénicos del Plata",
    email: "contacto@shplata.com.ar",
  },
];

export default function Paso3() {
  // 1) obtenemos los datos de carátula igual que en Paso7
  const { caratula } = useCaratula();
  const hogar = caratula?.hogar || "Sin hogar";
  const mesTrabajo = caratula?.mes || "";
  // Lo que en Paso7 llamábamos “periodoFormateado”, aquí podemos reutilizar ese nombre:
  const periodoFormateado = mesTrabajo.toUpperCase();

  // 2) construimos STORAGE_KEY usando el mismo patrón:
  const STORAGE_KEY = `paso3_${hogar
    .toLowerCase()
    .replace(/\s+/g, "")}_${mesTrabajo.toLowerCase().replace(/\s+/g, "")}`;

  const { setUltimaFechaMailPaso3 } = useEmailContext();

  // 3) estado inicial: dejamos “periodo” en blanco; el primer useEffect lo completa.
  const [form, setForm] = useState({
    fechaLimite: "",
    horaLimite: "15:00",
    periodo: "", // se llena luego en useEffect
    numeroPliego: "PLIEG-2025-XXXXX-GCABA-DGPAPM",
    empresaSeleccionada: "",
  });

  const [emails, setEmails] = useState([]);
  const [texto, setTexto] = useState("");

  // 4) useEffect de carga: si hay algo en localStorage, úsalo.
  //    Si NO, precarga “periodo” con periodoFormateado
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        const parsed = JSON.parse(guardado);
        if (parsed.form) setForm(parsed.form);
        if (parsed.emails) setEmails(parsed.emails);
        if (parsed.texto) setTexto(parsed.texto);
      } catch {
        console.error("Error al parsear datos guardados en Paso3");
      }
    } else {
      // No existe nada en storage: seteamos el campo “periodo” con valor de carátula
      setForm((prev) => ({ ...prev, periodo: periodoFormateado }));
    }
  }, [STORAGE_KEY, periodoFormateado]);

  // 5) useEffect de guardado: cada vez que cambie “form” o “texto”, persistimos en localStorage
  useEffect(() => {
    if (texto) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ form, emails, texto })
      );
    }
  }, [form, emails, texto, STORAGE_KEY]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const copiarAlPortapapeles = (textoACopiar) => {
    navigator.clipboard.writeText(textoACopiar);
    alert("Contenido copiado al portapapeles");
  };

  const generarEmails = (e) => {
    e.preventDefault();
    if (!caratula) {
      alert("Primero debes seleccionar una carátula en Paso 1.");
      return;
    }

    // Generamos los emails usando “periodo” que ya está cargado.
    const seleccionadas = form.empresaSeleccionada
      ? empresas.filter((emp) => emp.email === form.empresaSeleccionada)
      : empresas;

    const nuevosEmails = seleccionadas.map((empresa, index) => {
      const fechaEnvioRaw = calcularFechaEnvioPorCorreo(
        form.fechaLimite,
        index * 13
      );
      const fechaFormateada = fechaEnvioRaw.toLocaleString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const cuerpo = `
SR. ${empresa.nombre.toUpperCase()}:

Tengo el agrado de dirigirme a Usted, en mi carácter de Director General de Políticas Asistenciales para Personas Mayores dependiente de la Subsecretaría de Personas Mayores del Ministerio de Desarrollo Humano y Hábitat del Gobierno de la Ciudad Autónoma de Buenos Aires, a efectos de solicitar tenga a bien remitir una cotización económica en el marco de la contratación de un servicio de lavandería destinado a los Hogares de Residencia para Adultos Mayores “San Martín” y “Rawson”.

A fin de confeccionar el presupuesto oficial del proceso de compra que se propicia, la cotización deberá ser realizada de acuerdo a la información suministrada en el PLIEGO TÉCNICO (${
        form.numeroPliego
      }) y deberá ser remitida por este medio con membrete indicando razón social y CUIT de la empresa, y firmada por apoderado o representante con aclaración.

Dicha cotización podrá enviarse hasta el día ${new Date(form.fechaLimite)
        .toLocaleDateString("es-AR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        .toUpperCase()}, hasta las ${
        form.horaLimite
      } hs inclusive. Dicho presupuesto deberá contemplar los servicios de ${
        form.periodo
      }.
      `.trim();

      return {
        para: empresa.email,
        fecha: fechaFormateada,
        cuerpo,
        fechaObj: fechaEnvioRaw,
      };
    });

    const ultimaFecha = nuevosEmails
      .map((e) => e.fechaObj)
      .reduce((max, curr) => (curr > max ? curr : max), new Date(0));
    setUltimaFechaMailPaso3(ultimaFecha);

    setEmails(nuevosEmails);
    const textoFinal = nuevosEmails
      .map((e) => `${e.fecha} – ${e.para}\n\n${e.cuerpo}`)
      .join("\n\n---\n\n");
    setTexto(textoFinal);
  };

  const borrar = () => {
    localStorage.removeItem(STORAGE_KEY);
    setForm({
      fechaLimite: "",
      horaLimite: "15:00",
      periodo: periodoFormateado,
      numeroPliego: "PLIEG-2025-XXXXX-GCABA-DGPAPM",
      empresaSeleccionada: "",
    });
    setEmails([]);
    setTexto("");
  };

  return (
    <form className="space-y-4" onSubmit={generarEmails}>
      {/* Mostrar siempre el banner de carátula */}
      <CaratulaActivaBanner />

      {!caratula ? (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-yellow-800">
          Primero debés seleccionar una carátula en el Paso 1.
        </div>
      ) : (
        <>
          {/* Aquí podrías repetir línea de “Carátula activa: Hogar — MES — Exp: XXXX” 
              justo debajo del banner, si lo deseas */}
          <p className="text-sm text-gray-700">
            <strong>Carátula activa:</strong> {hogar} —{" "}
            {mesTrabajo.toUpperCase()} — Exp: {caratula.expediente}
          </p>

          <Input
            type="date"
            name="fechaLimite"
            value={form.fechaLimite}
            onChange={handleChange}
          />
          <Input
            name="horaLimite"
            placeholder="Horario límite (Ej: 15:00)"
            value={form.horaLimite}
            onChange={handleChange}
          />
          <Input
            name="periodo"
            placeholder="Meses de servicio (Ej: ABRIL a JUNIO de 2025)"
            value={form.periodo}
            onChange={handleChange}
            readOnly
          />
          <Input
            name="numeroPliego"
            placeholder="Número del pliego"
            value={form.numeroPliego}
            onChange={handleChange}
          />

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

          <div className="flex gap-2">
            <Button type="submit">Generar Email</Button>
            <Button type="button" variant="destructive" onClick={borrar}>
              Borrar
            </Button>
          </div>

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
                    <strong>Asunto:</strong> Solicitud de Cotización – Servicio
                    de Lavandería
                  </div>
                  <div>
                    <strong>Fecha:</strong> {email.fecha}
                  </div>
                  <hr className="my-2" />
                  <pre className="whitespace-pre-wrap text-gray-800">
                    {email.cuerpo}
                  </pre>
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
                    Este mensaje es una simulación de envío individual. No será
                    enviado por correo.
                  </div>
                </div>
              ))}
            </div>
          )}

          {texto && (
            <Textarea className="mt-4" rows={12} value={texto} readOnly />
          )}
        </>
      )}
    </form>
  );
}
