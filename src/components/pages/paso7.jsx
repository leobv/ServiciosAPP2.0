// src/components/formularios/Paso7.jsx
import { useEffect, useState } from "react";
import { useCaratula } from "@/context/CaratulaContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate_ddMMyyyy } from "@/lib/formatDate";

export default function Paso7() {
  const { caratula } = useCaratula();
  const hogar = caratula?.hogar || "Sin hogar";
  const mesTrabajo = caratula?.mes || "";
  const periodoFormateado = mesTrabajo.toUpperCase();

  // Clave de localStorage: “paso7_hogary_mes”
  const STORAGE_KEY = `paso7_${hogar
    .toLowerCase()
    .replace(/\s+/g, "")}_${mesTrabajo.toLowerCase().replace(/\s+/g, "")}`;

  // 1) Estado inicial: incluye “periodo: periodoFormateado”
  const [form, setForm] = useState({
    periodo: periodoFormateado,
    montoSanMartin: "7.700.000",
    montoRawson: "10.000.000",
    montoTotal: "",
    oferta: "17.700.000",
  });

  const [texto, setTexto] = useState("");

  // 2) Al montar, si hay algo guardado en localStorage, recupéralo.
  //    Si NO hay nada guardado, precarga el “periodo” desde la carátula.
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        const parsed = JSON.parse(guardado);
        setForm(parsed.form || form);
        setTexto(parsed.texto || "");
      } catch {
        // ignorar error de parseo
      }
    } else {
      // Si no existe nada guardado, forzamos la carga del periodo actual
      setForm((prev) => ({ ...prev, periodo: periodoFormateado }));
    }
  }, [STORAGE_KEY, periodoFormateado]);

  // 3) Cada vez que cambie “form” o “texto”, guardamos en localStorage
  useEffect(() => {
    if (texto) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, texto }));
    }
  }, [form, texto, STORAGE_KEY]);

  // … resto de la lógica de handleChange/generarTexto/borrarFormulario …
}
