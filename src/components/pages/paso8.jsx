// src/components/formularios/Paso8.jsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCaratula } from "@/context/CaratulaContext";

export default function Paso8() {
  // 1) obtenemos carátula
  const { caratula } = useCaratula();
  const hogar = caratula?.hogar || "Sin hogar";
  const mesTrabajo = caratula?.mes || "";
  const periodoFormateado = mesTrabajo.toUpperCase();

  // 2) construimos la STORAGE_KEY (misma lógica que en Paso7/Paso3)
  const STORAGE_KEY = `paso8_${hogar
    .toLowerCase()
    .replace(/\s+/g, "")}_${mesTrabajo.toLowerCase().replace(/\s+/g, "")}`;

  // 3) estado inicial: dejamos en blanco expediente/servicio/periodo
  const [form, setForm] = useState({
    expediente: "",
    servicio: "",
    periodo: "",
  });
  const [texto, setTexto] = useState("");

  // 4) Al montar, recuperamos de localStorage si existe.
  //    Si NO existe nada guardado, no hacemos nada aquí (esperamos a que caratula llegue).
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        const parsed = JSON.parse(guardado);
        if (parsed.form) {
          setForm(parsed.form);
        }
        if (parsed.texto) {
          setTexto(parsed.texto);
        }
      } catch {
        console.error("Error al parsear datos guardados en Paso8");
      }
    }
    // NOTA: No precargamos nada aquí si no hay guardado,
    //       porque quizá caratula todavía no llegó.
  }, [STORAGE_KEY]);

  // 5) Cada vez que cambie `caratula`, si el formulario aún está vacío,
  //    precargamos expediente y periodo desde la carátula.
  useEffect(() => {
    if (!caratula) return;

    // Si no hay datos en el form (solo expediente o solo periodo vacío),
    // lo rellenamos con la carátula
    const formVacio = form.expediente === "" && form.periodo === "";

    if (formVacio) {
      setForm({
        expediente: caratula.expediente || "",
        servicio: "",
        periodo: periodoFormateado,
      });
    }
  }, [caratula, periodoFormateado, form.expediente, form.periodo]);

  // 6) Guardamos en localStorage cada vez que cambien form o texto
  useEffect(() => {
    // Solo guardamos si ya hubo al menos un texto generado (evitamos que se sobreescriba
    // un guardado previo con un objeto vacío)
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
    if (!caratula) {
      alert("Primero debés seleccionar una carátula en el Paso 1.");
      return;
    }

    const resultado = `
NOTA

En relación al expediente ${form.expediente}, mediante el cual la Dirección General de Políticas Asistenciales para Personas Mayores solicita autorización para la contratación del ${form.servicio}, correspondiente al período ${form.periodo}, se deja constancia que esta Subsecretaría toma conocimiento de lo actuado y presta conformidad para la prosecución del trámite administrativo pertinente.

Se remite a los fines de su prosecución.
    `.trim();

    setTexto(resultado);
  };

  const borrar = () => {
    localStorage.removeItem(STORAGE_KEY);
    setForm({
      expediente: caratula?.expediente || "",
      servicio: "",
      periodo: periodoFormateado,
    });
    setTexto("");
  };

  return (
    <form className="space-y-4" onSubmit={generarTexto}>
      <h2 className="text-lg font-semibold">Paso 8: Nota de Conformidad</h2>

      {!caratula ? (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-yellow-800">
          Primero debés seleccionar una carátula en el Paso 1.
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700">
            <strong>Carátula activa:</strong> {hogar} —{" "}
            {mesTrabajo.toUpperCase()} — Exp: {caratula.expediente}
          </p>

          <Input
            name="expediente"
            value={form.expediente}
            onChange={handleChange}
            placeholder="Código de expediente"
            readOnly
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
            readOnly
          />

          <div className="flex gap-2">
            <Button type="submit">Generar Nota</Button>
            <Button type="button" variant="destructive" onClick={borrar}>
              Borrar
            </Button>
          </div>

          {texto && (
            <Textarea className="mt-4" rows={10} value={texto} readOnly />
          )}
        </>
      )}
    </form>
  );
}
