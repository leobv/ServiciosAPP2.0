// src/agents/pasos/paso5.js
// Devuelve texto y un campo que luego aprovecha el paso7
export function generarPaso5({ dataPrevio }) {
  const otrosMontos = Number(dataPrevio?.otrosMontos ?? 0) || 0;
  return {
    texto: `Detalle de montos de otras empresas: $${otrosMontos}`,
    otrosMontos,
  };
}
