// useParametrosActuales.js
import { useCaratula } from '@/context/CaratulaContext';

export function useParametrosActuales() {
  const { caratula } = useCaratula();
  return {
    hogar: caratula?.hogar || 'San Martín',
    mes: caratula?.mes || 'abril2025',
  };
}
