import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';

export default function PresupuestoPdfRichard({ texto, fondo }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const generarPDF = async () => {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 50;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = fondo;

      img.onload = () => {
        doc.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);

        doc.setFont('Times', 'Roman');
        doc.setFontSize(12);
        doc.setTextColor(40);

        // Aquí utilizas el texto dinámicamente
        const lineas = texto.split('\n');

        let y = 130;
        lineas.forEach((linea) => {
          doc.text(linea, margin, y);
          y += 22;
        });

        // Generar vista previa
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      };
    };

    generarPDF();
  }, [texto, fondo]);

  return (
    <div className="space-y-4">
      {pdfUrl ? (
        <>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Vista previa del PDF"
            className="border rounded shadow"
          />
          <a
            href={pdfUrl}
            download="Presupuesto-Richard.pdf"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Descargar PDF
          </a>
        </>
      ) : (
        <p className="text-gray-600">Generando PDF...</p>
      )}
    </div>
  );
}
