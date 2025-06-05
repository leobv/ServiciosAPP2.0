import { useCaratula } from '@/context/CaratulaContext';

export default function CaratulaActivaBanner() {
  const { caratula } = useCaratula();
  if (!caratula) return null;
  const { hogar, mes, expediente } = caratula;

  return (
    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded shadow text-sm mb-4">
      <strong>Carátula activa:</strong> {hogar} — {mes.toUpperCase()} — Expediente: {expediente || '—'}
    </div>
  );
}
