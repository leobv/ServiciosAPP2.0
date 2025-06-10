// src/components/formularios/Paso11.jsx

import React, { useState, useEffect } from "react";
import { useCaratula } from "@/context/CaratulaContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * Convierte "abril2025" → "abril de 2025"
 */
function formatoMesYAnio(mes) {
  if (!mes || mes.length <= 4) return "";
  const año = mes.slice(-4);
  const mesTexto = mes.slice(0, mes.length - 4).toLowerCase();
  return `${mesTexto} de ${año}`;
}

export default function Paso11() {
  // 1) Leemos la carátula activa
  const { caratula } = useCaratula();
  const hogar = caratula?.hogar || "Sin hogar";
  const mes = caratula?.mes || ""; // ej. "marzo2025"
  const periodoTexto = formatoMesYAnio(mes); // "marzo de 2025"
  const remito = caratula?.remito || ""; // ej. "RM-2025-15356975-GCABA-DGPAPM"
  const monto = caratula?.monto || ""; // ej. "17.700.000"

  // 2) Key para localStorage: “paso11_<hogar>_<mes>”
  const STORAGE_KEY = `paso11_${hogar.toLowerCase().replace(/\s+/g, "")}_${mes
    .toLowerCase()
    .replace(/\s+/g, "")}`;

  // 3) Estado local: campos IF y el resultado “textoDisposicion”
  const [form, setForm] = useState({
    ifPresupuestos: "",
    ifAnalisis: "",
    ifRegistro: "",
  });
  const [textoDisposicion, setTextoDisposicion] = useState("");

  // 4) Al montar, tratamos de recuperar de localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm(parsed.form || form);
        setTextoDisposicion(parsed.texto || "");
      } catch (err) {
        console.error("Error al leer Paso11 de localStorage:", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY]);

  // 5) Si cambia carátula y el form está “vacío”, precargamos campos para sincronizar
  useEffect(() => {
    if (!caratula) return;
    const formVacio =
      form.ifPresupuestos === "" &&
      form.ifAnalisis === "" &&
      form.ifRegistro === "";

    if (formVacio) {
      setForm({
        ifPresupuestos: "",
        ifAnalisis: "",
        ifRegistro: "",
      });
      setTextoDisposicion("");
    }
  }, [caratula, form.ifPresupuestos, form.ifAnalisis, form.ifRegistro]);

  // 6) Guardamos en localStorage cada vez que cambian `form` o `textoDisposicion`
  useEffect(() => {
    if (
      form.ifPresupuestos ||
      form.ifAnalisis ||
      form.ifRegistro ||
      textoDisposicion
    ) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ form, texto: textoDisposicion })
      );
    }
  }, [form, textoDisposicion, STORAGE_KEY]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 7) Al hacer clic en “Generar Disposición”, construimos el texto completo:
  const generarDisposicion = (e) => {
    e.preventDefault();
    if (!caratula) {
      alert("Primero debés seleccionar una carátula en el Paso 1.");
      return;
    }
    if (
      !form.ifPresupuestos.trim() ||
      !form.ifAnalisis.trim() ||
      !form.ifRegistro.trim()
    ) {
      alert("Completá todos los campos de IF antes de generar la disposición.");
      return;
    }

    // Construimos el bloque “VISTO”
    const visto = `VISTO: La Ley N° 6.684, los Decretos N° 433 GCABA/16 y modificatorios, N° 387-GCABA-AJG/23 y su modificatorio Decreto 69/2025, Decreto Nº 92/GCABA/AJG/2025, el ${caratula.expediente} y,`;

    // Construimos el bloque “CONSIDERANDO”
    const considerando = `
CONSIDERANDO:

Que, por el Expediente Electrónico citado en el Visto tramita el reconocimiento del gasto correspondiente al servicio de lavado, desinfectado, secado, planchado, retiro y entrega de ropa de cama y ropa de cuerpo, con destino a los Hogares de Residencia para Adultos Mayores “San Martín” y “Rawson” dependientes a la Dirección General Políticas Asistenciales para Personas Mayores, realizado durante el mes ${periodoTexto}, efectuado por la firma El Ingale SRL CUIT 30-69038860-6, en el amparo de lo establecido por el Decreto N° 433-GCABA/16 y sus modificatorios;

Que, mediante la Ley N° 6.684, se aprobó la Ley de Ministerios creándose la estructura orgánico funcional del Poder Ejecutivo del Gobierno de la Ciudad Autónoma de Buenos Aires;

Que, por Decreto N° 387-GCABA-AGJ/23 y su modificatorio, se aprobó la estructura orgánico funcional del Poder Ejecutivo de la Ciudad Autónoma de Buenos Aires, contemplándose bajo la órbita de la Vicejefatura de Gobierno a Secretaría de Bienestar Integral;

Que, según lo dispuesto por el Decreto N° 387-GCABA-AGJ/23 y su modificatorio bajo la órbita de la Secretaría de Bienestar Integral se encuentra la Dirección General Políticas Asistenciales para Personas Mayores la cual tiene entre sus competencias administrar los establecimientos de Hogares de Residencia Permanente y los dispositivos habitacionales transitorios de la Ciudad Autónoma de Buenos Aires, que tengan como beneficiarios a personas mayores brindando un adecuado cuidado;

Que por Decreto 69/2025, se modificó a partir del 1° de febrero de 2025, la estructura organizativa del Ministerio de Desarrollo Humano y Hábitat;

Que por el Decreto Nº 92/GCABA/AJG/2025, quien suscribe, Sr. Mauricio Nicolás Damiano, fue designado, a partir del 1 de febrero del 2025, como Director General Políticas Asistenciales para Personas Mayores dependiente de la Subsecretaría para Personas Mayores del Ministerio de Desarrollo Humano y Hábitat;

Que dentro de las competencias de esta Dirección General se contempla: “Diseñar y administrar la asistencia integral a personas mayores en situación de emergencia social y económica promoviendo su integración familiar y comunitaria”; “Prestar servicios de asistencia inmediata a personas mayores en situación de emergencia social o habitacional, en coordinación con el Ministerio de Desarrollo Humano y Hábitat”; “Implementar y administrar los programas de entrega de subsidios que tengan como beneficiarios a las personas mayores”;

Que, mediante el Decreto N°433-GCABA/16 y sus modificatorios, se establecieron los niveles de decisión y cuadro de competencias para los actos administrativos de ejecución presupuestaria para la gestión descentralizada en las Jurisdicciones y Entidades del Poder Ejecutivo del Gobierno de la Ciudad Autónoma de Buenos Aires;

Que, con respecto al procedimiento seleccionado, corresponde destacar que la importancia y la celeridad con la cual se debió llevar a cabo la adquisición mencionada impidió realizar otro procedimiento previsto en la normativa vigente;

Que, cabe señalar que el servicio resultó imprescindible a los efectos de continuar brindando el servicio de lavado, desinfectado, secado, planchado, retiro y entrega de ropa de cama y ropa de cuerpo en los Hogares de Residencia para Adultos Mayores “San Martín” y “Rawson” dependientes de la Dirección General Políticas Asistenciales para Personas Mayores;

Que obran en los presentes actuados, mediante ${form.ifPresupuestos} tres (3) presupuestos remitidos por diferentes empresas, extremo que satisface la exigencia establecida por el inciso b) del artículo 3º del Decreto N° 433/16 y sus modificatorios;

Que, de acuerdo al ${form.ifAnalisis}, esta Dirección General Políticas Asistenciales para Personas Mayores, realizó el correspondiente análisis de las propuestas recibidas, resultando la más conveniente a los intereses del Gobierno de la Ciudad Autónoma de Buenos Aires, en lo que hace al precio y a la prestación, la presentada por la empresa El Ingale SRL CUIT 30-69038860-6, por la suma total de Diecisiete Millones Setecientos Mil ($${monto}.-);

Que, en consecuencia, la aprobación del gasto a favor del mencionado proveedor;

Que, conforme surge del ${form.ifRegistro}, la firma en cuestión se encuentra debidamente inscripta en el Registro Informatizado Único y Permanente de Proveedores (RIUPP) del Sistema Buenos Aires Compras (BAC), de conformidad con lo exigido en el inciso c) del artículo 3 del Decreto N° 433-GCABA/16 y sus modificatorios;

Que, asimismo, se encuentra vinculado remito valorizado correspondiente al mes ${periodoTexto} de los hogares, San Martín y Rawson, bajo el N° de ${remito}, presentado por la empresa mencionada, el cual se encuentra debidamente conformado;

Que se ha formulado la respectiva asignación presupuestaria.

Por ello, y en uso de las facultades atribuidas por el Decreto N° 433-GCABA/16 y sus modificatorios,

EL DIRECTOR GENERAL DE POLÍTICAS ASISTENCIALES PARA PERSONAS MAYORES

DISPONE

Artículo 1°. – Aprobar, el gasto de carácter esencial e impostergable correspondiente al servicio de lavado, desinfectado, secado, planchado, retiro y entrega de ropa de cama y ropa de cuerpo en los Hogares de Residencia para Adultos Mayores “San Martín” y “Rawson”, efectuado por la empresa El Ingale SRL CUIT 30-69038860-6, realizado durante el mes de ${periodoTexto}, por la suma total de PESOS Diecisiete Millones Setecientos Mil ($${monto}.-) de conformidad con lo establecido en el Decreto N° 433-GCABA/16 y sus modificatorios.

Artículo 2°.- Dejar constancia que el presente gasto fue imputado a la partida presupuestaria correspondiente.

Artículo 3°.- Emitir el correspondiente parte de recepción definitiva.

Artículo 4°. - Notifíquese a la firma El Ingale SRL CUIT 30-69038860-6, conforme Arts. 62 y 63 de la Ley de Procedimientos Administrativos de la Ciudad Autónoma de Buenos Aires. Cumplido, archívese.
    `.trim();

    // --------------- CORRECCIÓN: definimos `resultado` antes de usarlo ---------------
    const resultado = `${visto}\n\n${considerando}`;
    setTextoDisposicion(resultado);
  };

  const borrar = () => {
    localStorage.removeItem(STORAGE_KEY);
    setForm({
      ifPresupuestos: "",
      ifAnalisis: "",
      ifRegistro: "",
    });
    setTextoDisposicion("");
  };

  return (
    <form className="space-y-4 max-w-3xl mx-auto" onSubmit={generarDisposicion}>
      <h2 className="text-lg font-semibold">
        Paso 11: Disposición Aprobatoria
      </h2>

      {!caratula ? (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-yellow-800">
          Primero debés seleccionar una carátula en el Paso 1.
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700">
            <strong>Carátula activa:</strong> {hogar} — {mes.toUpperCase()} —
            Exp: {caratula.expediente}
          </p>

          {/* Campos para pegar cada número de IF */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IF (presupuestos)*
              </label>
              <Input
                name="ifPresupuestos"
                value={form.ifPresupuestos}
                onChange={handleChange}
                placeholder="Ej: IF-2025-14079035-GCABA-DGPAPM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IF (análisis)*
              </label>
              <Input
                name="ifAnalisis"
                value={form.ifAnalisis}
                onChange={handleChange}
                placeholder="Ej: IF-2025-14074311-GCABA-DGPAPM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IF (registro)*
              </label>
              <Input
                name="ifRegistro"
                value={form.ifRegistro}
                onChange={handleChange}
                placeholder="Ej: IF-2025-12929672-GCABA-DGPAPM"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Generar Disposición</Button>
            <Button type="button" variant="destructive" onClick={borrar}>
              Borrar
            </Button>
          </div>

          {textoDisposicion && (
            <div className="mt-4 border rounded p-4 bg-white whitespace-pre-wrap text-sm leading-relaxed shadow-sm">
              <pre>{textoDisposicion}</pre>
            </div>
          )}
        </>
      )}
    </form>
  );
}
