// src/components/formularios/Paso5.jsx

import React, { useState, useEffect } from "react";
import { useCaratula } from "@/context/CaratulaContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PresupuestoPdfRichard from "@/components/PresupuestoPdfRichard.jsx";

/**
 * Convierte "abril2025" → "2025-04-01" (primer día del mes)
 */
function fechaInicioDelMes(mes) {
  if (typeof mes !== "string" || mes.length <= 4) return "";
  const año = parseInt(mes.slice(-4), 10);
  const nombreMes = mes.slice(0, mes.length - 4).toLowerCase();
  const mapeo = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  };
  const mm = mapeo[nombreMes] || 1;
  const mmStr = mm.toString().padStart(2, "0");
  return `${año}-${mmStr}-01`;
}

/**
 * Convierte "abril2025" → "ABRIL 2025"
 */
function formatoPeriodo(mes) {
  if (!mes) return "";
  const año = mes.slice(-4);
  const mesTexto = mes.slice(0, mes.length - 4);
  return `${mesTexto.toUpperCase()} ${año}`;
}

export default function Paso5() {
  // 1) Obtenemos la carátula activa con useCaratula()
  const { caratula } = useCaratula();
  const hogar = caratula?.hogar || "Sin hogar";
  const mes = caratula?.mes || ""; // ej. "abril2025"
  const fechaInicial = fechaInicioDelMes(mes); // "2025-04-01"
  const periodoInicial = formatoPeriodo(mes); // "ABRIL 2025"

  // 2) Buildeamos la clave de localStorage: "paso5_<hogar>_<mes>" (todo sin espacios)
  const claveStorage = `paso5_${hogar.toLowerCase().replace(/\s+/g, "")}_${mes
    .toLowerCase()
    .replace(/\s+/g, "")}`;

  // 3) Estado inicial: lo dejamos vacío; luego lo rellenará el efecto si corresponde.
  const [form, setForm] = useState({
    fecha: "",
    periodo: "",
    empresa: "Lavadero Richard",
  });
  const [mostrarPDF, setMostrarPDF] = useState(false);

  // 4) Efecto para recuperar de localStorage (o dejar en blanco si no hay nada guardado)
  useEffect(() => {
    const saved = localStorage.getItem(claveStorage);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm(parsed);
      } catch (err) {
        console.error("Error al leer Paso5 de localStorage:", err);
      }
    }
    // Si no hay guardado, no hacemos nada aquí: esperamos al siguiente efecto
  }, [claveStorage]);

  // 5) Efecto para precargar datos de la carátula si el formulario está “vacío”
  useEffect(() => {
    if (!caratula) return;

    // Consideramos “vacío” si ambos campos están en cadena vacía
    const formVacio = form.fecha === "" && form.periodo === "";

    if (formVacio) {
      setForm({
        fecha: fechaInicial,
        periodo: periodoInicial,
        empresa: form.empresa || "Lavadero Richard",
      });
    }
  }, [caratula, fechaInicial, periodoInicial, form.fecha, form.periodo]);

  // 6) Cada vez que cambie `form`, lo guardamos en localStorage
  useEffect(() => {
    // Solo guardamos si ya dimos click para generar o el usuario modificó algo:
    // (podrías omitir esta condición y siempre sobrescribir, pero así evitamos
    //  pisar con un estado totalmente vacío)
    if (form.fecha || form.periodo || form.empresa) {
      localStorage.setItem(claveStorage, JSON.stringify(form));
    }
  }, [form, claveStorage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 7) Texto fijo que irá dentro del PDF (puedes adaptarlo dinámicamente si necesitas)
  const textoParaPDF = `
BUENOS AIRES ${form.fecha}
Dirección General Políticas Asistenciales para Personas Mayores
De mi consideración:

Según su pedido, enviamos cotización por el servicio de lavado, planchado, retiro y entrega
de ropa de cama y ropa de cuerpo, con un servicio diario.

El servicio tiene un valor total para el mes de ${form.periodo} para los hogares que
se detallan según su solicitud:

Hogar San Martín: $12.925.000  
Hogar Rawson: $10.975.000  

Monto final cotizado para el mes de ${form.periodo} es de pesos
Novecientos Mil ($23.900.000).
  `.trim();

  // 8) Buscamos la ruta de la imagen de fondo según la empresa seleccionada
  const empresas = [
    { nombre: "Lavadero Richard", fondo: "/20250411_130047.jpg" },
    // ← si agregas más empresas, pon aquí: { nombre: 'Otra', fondo: '/ruta.jpg' }
  ];
  const fondoSeleccionado = empresas.find(
    (e) => e.nombre === form.empresa
  )?.fondo;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Si no hay carátula activa, le avisamos al usuario que primero la seleccione */}
      {!caratula ? (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-yellow-800">
          Primero debés seleccionar una carátula en el Paso 1.
        </div>
      ) : (
        <>
          {/* Mostrar la carátula activa en un texto informativo */}
          <p className="text-sm text-gray-700">
            <strong>Carátula activa:</strong> {hogar} — {mes.toUpperCase()} —
            Exp: {caratula.expediente}
          </p>

          {/* Selección de empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa destinataria:
            </label>
            <select
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm"
            >
              {empresas.map((e) => (
                <option key={e.nombre} value={e.nombre}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Inputs de fecha y período */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de emisión:
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="border rounded p-2 w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período (mes activo):
              </label>
              <input
                type="text"
                name="periodo"
                value={form.periodo}
                onChange={handleChange}
                className="border rounded p-2 w-full text-sm"
                placeholder="Ej: ABRIL 2025"
                readOnly
              />
            </div>
          </div>

          {/* Vista previa del texto dentro de un contenedor */}
          <div className="border rounded p-4 bg-white whitespace-pre-wrap text-sm leading-relaxed shadow-sm">
            <pre>{textoParaPDF}</pre>
          </div>

          {/* Botón para activar vista previa / descarga de PDF */}
          <div className="flex justify-start">
            <Button
              onClick={() => {
                if (!form.fecha || !form.periodo) {
                  alert(
                    "Debes completar la fecha y el período antes de generar el PDF."
                  );
                  return;
                }
                setMostrarPDF(true);
              }}
              className="bg-green-600 text-white"
            >
              Vista previa / Descargar PDF
            </Button>
          </div>

          {/* Componente que muestra el PDF en un contenedor scrollable */}
          {mostrarPDF && (
            <div
              className="mt-4 border rounded overflow-auto"
              style={{ height: "600px" }}
            >
              {fondoSeleccionado ? (
                <PresupuestoPdfRichard
                  texto={textoParaPDF}
                  fondo={fondoSeleccionado}
                />
              ) : (
                <p className="text-red-600 p-4">
                  No se encontró la imagen de fondo para la empresa
                  seleccionada.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
