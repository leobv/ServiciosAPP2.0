import { useCaratula } from '@/context/CaratulaContext';

export function usePasoKey(numeroPaso) {
  const { caratula } = useCaratula();

  const mes = (caratula?.mes || '').toLowerCase().replace(/\s+/g, '');
  const hogar = (caratula?.hogar || '').toLowerCase().replace(/\s+/g, '');

  return `paso${numeroPaso}_${hogar}_${mes}`;
}
