// src/agents/agente.js
import { generators } from "./pasos";
import { pasoKey } from "./utils/keys";

// Orden de ejecución de pasos automatizados
const ORDEN = [3, 5, 7];

export async function ejecutarAgente(caratula) {
  const progreso = [];

  for (const n of ORDEN) {
    try {
      const generar = generators[n];
      if (!generar) throw new Error("Generador no implementado");

      const key = pasoKey(n, caratula);
      const previoRaw = (typeof window !== "undefined") ? window.localStorage.getItem(key) : null;
      const previo = JSON.parse(previoRaw || "{}");

      // Cada generador puede devolver string (texto) o un objeto { texto, ...extras }
      const resultado = await Promise.resolve(generar({ caratula, dataPrevio: previo }));

      let payload;
      if (typeof resultado === "string") {
        payload = { texto: resultado, updatedAt: new Date().toISOString() };
      } else {
        payload = { ...resultado, updatedAt: new Date().toISOString() };
        if (!payload.texto) payload.texto = "(sin texto)";
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(payload));
      }
      progreso.push({ paso: n, ok: true });
    } catch (e) {
      progreso.push({ paso: n, ok: false, error: e?.message || String(e) });
    }
  }

  return progreso;
}
