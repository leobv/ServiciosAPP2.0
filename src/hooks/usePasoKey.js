import { useCabecera } from '@/hooks/useCabecera';

export function usePasoKey(numeroPaso) {
  const { mes, hogar } = useCabecera();

  const mesNorm = (mes || '').toLowerCase().replace(/\s+/g, '');
  const hogarNorm = (hogar || '').toLowerCase().replace(/\s+/g, '');
  return `paso${numeroPaso}_${hogarNorm}_${mesNorm}`;
}
