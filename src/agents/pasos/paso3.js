    // src/agents/pasos/paso3.js
    // Genera un texto base de comunicación/correo
    export function generarPaso3({ caratula }) {
      const { servicio, empresa, periodo, mes } = caratula || {};
      const periodoTxt = Array.isArray(periodo) ? periodo.join(", ") : (periodo || mes || "—");
      return `
ASUNTO: Comunicación sobre ${servicio ?? "servicio"} - ${periodoTxt}

Estimados,
Por la presente se informa respecto a la prestación de ${servicio ?? "—"} brindada por ${empresa ?? "—"} durante ${periodoTxt}.
Saludos.
      `.trim();
    }
