    // src/agents/pasos/paso7.js
    // Informe: usa datos de la carátula y puede sumar montos de Paso 5
    export function generarPaso7({ caratula, dataPrevio }) {
      const { servicio, empresa, periodo, mes, expediente, monto } = caratula || {};
      const periodoTxt = Array.isArray(periodo) ? periodo.join(", ") : (periodo || mes || "—");
      const otrosMontos = Number(dataPrevio?.otrosMontos ?? 0) || 0;

      return `
INFORME

Empresa: ${empresa ?? "—"}
Servicio: ${servicio ?? "—"}
Período: ${periodoTxt}
Expediente: ${expediente ?? "—"}

Monto proveedor: $${monto ?? "—"}
Montos de otras empresas (Paso 5): $${otrosMontos}

Desarrollo:
De acuerdo a lo actuado y en el marco del Decreto 433/16 y mod., se deja constancia...
      `.trim();
    }
