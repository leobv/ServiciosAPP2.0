import { useSearchParams } from 'react-router-dom';

export function useCabecera() {
  const [params] = useSearchParams();
  const hogar = params.get('hogar') || 'San Martín';
  const mes = params.get('mes') || 'abril2025';

  const clave = `cabecera_${hogar}_${mes}`;
  const datos = localStorage.getItem(clave);

  try {
    return datos
      ? { ...JSON.parse(datos), hogar, mes }
      : { expediente: '', remito: '', monto: '', servicio: '', hogar, mes };
  } catch {
    return { expediente: '', remito: '', monto: '', servicio: '', hogar, mes };
  }
}
