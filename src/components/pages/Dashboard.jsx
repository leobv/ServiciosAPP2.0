// src/components/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCaratula } from "@/context/CaratulaContext";
import { useAgente } from "@/hooks/useAgente";
import { pasoKey } from "@/agents/utils/keys";
import CaratulaActivaBanner from "@/components/CaratulaActivaBanner";

// Lista de pasos visibles en el Dashboard
const PASOS = [
  "Carátula",
  "PET",
  "Invitación a cotizar",
  "RIUPP",
  "Presupuestos",
  "Constancias de AFIP",
  "Informe o nota DG",
  "Respuesta SUBSE",
  "Inicio de Actividades",
  "Remito",
  "IF del Proyecto de AA",
  "Informe DG Reconocimiento",
  "Conocimiento de la Subse",
  "Pase a SGO COMPRAS",
  "Actualización RUIPP",
  "Solicitud de Gasto",
  "Informe SGO COMPRAS",
  "Aprobación del Gasto",
  "Aprobación del AA",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { caratula } = useCaratula();
  const { run, progreso, running } = useAgente();

  // Estado local para ver documentos generados (Modal)
  const [open, setOpen] = useState(false);
  const [visiblePaso, setVisiblePaso] = useState(null);
  const [visibleTexto, setVisibleTexto] = useState("");

  const hogar = caratula?.hogar ?? null;
  const periodo = useMemo(() => {
    // Se admite carátula con `mes` o `periodo` (string o array)
    if (!caratula) return null;
    if (Array.isArray(caratula.periodo)) return caratula.periodo.join("-");
    return caratula.mes || caratula.periodo || null;
  }, [caratula]);

  // Construye mapa de estados leyendo localStorage
  const [estados, setEstados] = useState({});
  const rebuildEstados = () => {
    if (!hogar || !periodo) return setEstados({});
    const next = {};
    PASOS.forEach((_, idx) => {
      const pasoN = idx + 1;
      const key = pasoKey(pasoN, { hogar, mes: periodo, periodo });
      try {
        const raw = localStorage.getItem(key);
        next[pasoN] = raw ? JSON.parse(raw) : null;
      } catch {
        next[pasoN] = null;
      }
    });
    setEstados(next);
  };

  useEffect(() => {
    rebuildEstados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hogar, periodo]);

  // Cuando termina el agente, refrescar estados
  useEffect(() => {
    if (!running && progreso?.length) rebuildEstados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, JSON.stringify(progreso)]);

  const handleVer = (pasoN) => {
    if (!hogar || !periodo) return;
    const key = pasoKey(pasoN, { hogar, mes: periodo, periodo });
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setVisibleTexto(typeof parsed?.texto === "string" ? parsed.texto : JSON.stringify(parsed, null, 2));
    } catch {
      setVisibleTexto(raw);
    }
    setVisiblePaso(pasoN);
    setOpen(true);
  };

  if (!hogar || !periodo) {
    return (
      <div className="p-4 space-y-4">
        <div className="rounded-md border bg-muted/30 p-4 text-sm">
          No hay <strong>carátula activa</strong>. Creá/seleccioná una en el Paso 1 para comenzar.
        </div>
        <Button onClick={() => navigate("/pasos/1")}>Ir a Paso 1</Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Contexto activo */}
      <CaratulaActivaBanner />

      {/* Acción principal: Agente */}
      <div className="flex items-center gap-3">
        <Button onClick={run} disabled={running}>
          {running ? "Ejecutando…" : "🚀 Ejecutar agente (3, 5 y 7)"}
        </Button>
        {progreso?.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {progreso.filter(p => p.ok).length} ok / {progreso.length} pasos
          </div>
        )}
      </div>

      {/* Resultado breve del agente */}
      {progreso?.length > 0 && (
        <ul className="text-sm space-y-1">
          {progreso.map((p) => (
            <li key={p.paso}>Paso {p.paso}: {p.ok ? "✔ OK" : `❌ ${p.error}`}</li>
          ))}
        </ul>
      )}

      {/* Grilla de pasos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PASOS.map((nombre, idx) => {
          const pasoN = idx + 1;
          const saved = estados[pasoN];
          const isGenerable = [3, 5, 7].includes(pasoN);
          const status = saved ? "Completado" : "Pendiente";
          return (
            <Card key={pasoN} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Paso {pasoN}</div>
                    <div className="font-medium leading-tight">{nombre}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${saved ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-amber-300 bg-amber-50 text-amber-700"}`}>
                    {status}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  {isGenerable && saved && (
                    <Button variant="secondary" size="sm" onClick={() => handleVer(pasoN)}>
                      Ver
                    </Button>
                  )}
                  {!saved && isGenerable && (
                    <Button variant="outline" size="sm" onClick={run} disabled={running}>
                      Generar con agente
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/pasos/${pasoN}`)}>
                    Abrir paso
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal de vista */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Documento generado — {hogar} / {String(periodo).toUpperCase()} — Paso {visiblePaso}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={visibleTexto}
            className="w-full mt-4 text-sm whitespace-pre-wrap"
            readOnly
            rows={24}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

