import { useCabecera } from '@/hooks/useCabecera';

export default function CaratulaActivaBanner() {
  const { hogar, mes, expediente } = useCabecera();
  if (!hogar || !mes) return null;

  return (
    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded shadow text-sm mb-4">
      <strong>Carátula activa:</strong> {hogar} — {mes.toUpperCase()} — Expediente: {expediente || '—'}
    </div>
  );
}
