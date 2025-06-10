// src/layouts/MainLayout.jsx

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useCaratula } from "@/context/CaratulaContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Lista completa de pasos (26 ítems), igual que en Dashboard
const pasos = [
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
  "Notificación del AA",
  "Pase a SGO COMPRAS",
  "Afectación Definitiva",
  "Orden de Compra",
  "Parte de Recepción Definitiva",
  "Devolución a la DG",
  "Repetición desde punto 10",
];

export default function MainLayout() {
  const { caratula } = useCaratula();
  const navigate = useNavigate();
  const location = useLocation();

  // Detectamos si estamos en /dashboard para ocultar el sidebar
  const esDashboard = location.pathname.startsWith("/dashboard");

  // Información de carátula activa
  const hogar = caratula?.hogar || "";
  const mes = caratula?.mes || "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen">
      {/* 
        Si NO estamos en dashboard, mostramos el sidebar 
        que contiene la lista de pasos y la info de carátula.
      */}
      {!esDashboard && (
        <ScrollArea className="border-r p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Pasos del proceso</h2>

          {caratula ? (
            <div className="text-sm bg-blue-100 text-blue-800 p-2 mb-4 rounded">
              <strong>{caratula.hogar}</strong> – {caratula.mes.toUpperCase()}
              <br />
              Expediente: {caratula.expediente}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic mb-4">
              Seleccioná una carátula
            </p>
          )}

          <ul className="space-y-2">
            {pasos.map((paso, i) => (
              <li
                key={i}
                onClick={() => navigate(`/paso/${i + 1}`)}
                className={cn(
                  "cursor-pointer px-3 py-2 rounded hover:bg-gray-200 transition"
                )}
              >
                {i + 1}. {paso}
              </li>
            ))}
          </ul>

          <hr className="my-4" />
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Ir al Dashboard
          </Button>
        </ScrollArea>
      )}

      {/* 
        Área principal (Outlet). 
        Si es Dashboard, ocupa todo (4 columnas en md), 
        sino ocupa 3 columnas y deja la 1era para el sidebar.
      */}
      <div
        className={cn(
          "p-4 overflow-y-auto",
          esDashboard ? "col-span-1 md:col-span-4" : "col-span-1 md:col-span-3"
        )}
      >
        <Outlet />
      </div>
    </div>
  );
}
