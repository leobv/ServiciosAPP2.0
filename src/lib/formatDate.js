// src/lib/formatDate.js

/**
 * Recibe una ISO string o Date válido, y devuelve "DD/MM/YYYY".
 * Si en algún paso quieren incluir hora, pueden agregar opciones.
 */
export function formatDate_ddMMyyyy(isoOrDate) {
    if (!isoOrDate) return '';
  
    const d = new Date(isoOrDate);
    if (isNaN(d)) return '';
  
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  
  /**
   * Ejemplo: formatea “día de mes de año, hh:mm”
   * p.ej.: "martes 14 de mayo de 2025, 09:35"
   */
  export function formatDate_verbose(isoOrDate) {
    if (!isoOrDate) return '';
  
    const d = new Date(isoOrDate);
    if (isNaN(d)) return '';
  
    // Opciones para idioma español
    return d.toLocaleString('es-AR', {
      weekday: 'long',    // e.g. "martes"
      day: 'numeric',     // e.g. "14"
      month: 'long',      // e.g. "mayo"
      year: 'numeric',    // e.g. "2025"
      hour: '2-digit',    // e.g. "09"
      minute: '2-digit',  // e.g. "35"
      hour12: false,
    });
  }
  