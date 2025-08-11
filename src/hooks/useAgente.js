// src/hooks/useAgente.js
import { useState } from "react";
import { ejecutarAgente } from "@/agents/agente";
import { useCaratula } from "@/context/CaratulaContext";

export function useAgente() {
  const { caratula } = (typeof useCaratula === "function" ? useCaratula() : { caratula: null });
  const [progreso, setProgreso] = useState([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    if (!caratula || !caratula?.hogar || !(caratula?.mes || caratula?.periodo)) {
      setProgreso([{ paso: 0, ok: false, error: "No hay carátula activa" }]);
      return;
    }
    setRunning(true);
    try {
      const res = await ejecutarAgente(caratula);
      setProgreso(res);
    } finally {
      setRunning(false);
    }
  };

  return { progreso, run, running };
}
