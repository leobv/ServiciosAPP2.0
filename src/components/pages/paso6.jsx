import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const empresas = [
  { nombre: 'Lavandería Sanitaria del Sur S.A.', cuit: '30-12345678-9' },
  { nombre: 'Industrias Cleantex S.R.L.', cuit: '30-87654321-0' },
  { nombre: 'Servicios Higiénicos del Plata', cuit: '30-11223344-5' },
];

export default function Paso6() {
  const [params] = useSearchParams();
  const mes = params.get('mes') || 'abril2025';

  const [empresa, setEmpresa] = useState(empresas[0]);
  const [archivo, setArchivo] = useState(null);
  const [archivoUrl, setArchivoUrl] = useState(null);

  const STORAGE_KEY = `paso6_${mes}_${empresa.cuit}`;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setArchivo(parsed.nombre || null);
      setArchivoUrl(parsed.url || null);
    }
  }, [STORAGE_KEY]);

  const abrirAfip = () => {
    window.open('https://seti.afip.gob.ar/padron-puc-constancia-internet/ConsultaConstanciaAction.do', '_blank');
  };

  const handleEmpresaChange = (e) => {
    const selected = empresas.find(emp => emp.cuit === e.target.value);
    setEmpresa(selected);
  };

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Solo se permite subir archivos PDF');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      setArchivo(file.name);
      setArchivoUrl(url);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nombre: file.name, url }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Empresa</label>
      <select value={empresa.cuit} onChange={handleEmpresaChange} className="border rounded p-2">
        {empresas.map((e) => (
          <option key={e.cuit} value={e.cuit}>
            {e.nombre}
          </option>
        ))}
      </select>

      <p className="text-sm text-gray-600">CUIT: <strong>{empresa.cuit}</strong></p>

      <button
        onClick={abrirAfip}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ir a AFIP para obtener constancia
      </button>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Subir constancia en PDF</label>
        <input type="file" accept=".pdf" onChange={handleArchivo} />
        {archivo && (
          <p className="text-sm text-green-700">Archivo cargado: <strong>{archivo}</strong></p>
        )}
      </div>

      {archivoUrl && (
        <div className="mt-4">
          <iframe
            src={archivoUrl}
            width="100%"
            height="500px"
            title="Vista previa constancia"
            className="border rounded shadow"
          />
        </div>
      )}
    </div>
  );
}
