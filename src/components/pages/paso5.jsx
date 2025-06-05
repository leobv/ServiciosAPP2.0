// src/components/formularios/Paso5.jsx

import React, { useState, useEffect } from 'react'
import { useCaratula } from '@/context/CaratulaContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PresupuestoPdfRichard from '@/components/PresupuestoPdfRichard.jsx'

/**
 * Convierte "abril2025" → { year: 2025, month: 4, day: 1 } (1er día del mes)
 * Usamos para inicializar el campo fecha.
 */
function fechaInicioDelMes(mes) {
  if (typeof mes !== 'string' || mes.length <= 4) return ''
  const año = parseInt(mes.slice(-4), 10)
  const nombreMes = mes.slice(0, mes.length - 4).toLowerCase()
  // Mapeo de nombres de mes a número
  const mapeo = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  }
  const mm = mapeo[nombreMes] || 1
  // Formatear a "YYYY-MM-DD"
  const mmStr = mm.toString().padStart(2, '0')
  return `${año}-${mmStr}-01`
}

/**
 * Convierte “abril2025” → “ABRIL 2025”
 */
function formatoPeriodo(mes) {
  if (!mes) return ''
  const año = mes.slice(-4)
  const mesTexto = mes.slice(0, mes.length - 4)
  return `${mesTexto.toUpperCase()} ${año}`
}

export default function Paso5() {
  // Obtenemos del contexto la carátula activa
  const { caratula } = useCaratula()
  const mes = caratula?.mes || ''
  const hogar = caratula?.hogar || ''

  // Si mes === "abril2025", fechaInicial será "2025-04-01"
  const fechaInicial = fechaInicioDelMes(mes)
  const periodoInicial = formatoPeriodo(mes)

  // Estado local del formulario
  const [form, setForm] = useState({
    fecha: fechaInicial,             // se inicializa al primer día del mes activo
    periodo: periodoInicial,         // “ABRIL 2025”
    empresa: 'Lavadero Richard',      // valor por defecto
  })
  const [mostrarPDF, setMostrarPDF] = useState(false)

  // Lista de empresas con su imagen de fondo (ajusta las rutas según tu proyecto)
  const empresas = [
    { nombre: 'Lavadero Richard', fondo: '/20250411_130047.jpg' },
    // aquí podrías agregar más: 
    // { nombre: 'Otra Empresa S.A.', fondo: '/ruta/de/la/imagen.jpg' },
  ]

  // Construimos la clave para localStorage: “paso5_<hogar>_<mes>”
  const claveStorage = `paso5_${hogar}_${mes}`

  // Al montar, tratamos de recuperar del localStorage
  useEffect(() => {
    const saved = localStorage.getItem(claveStorage)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setForm(parsed)
      } catch (err) {
        console.error('Error al leer Paso5 de localStorage:', err)
      }
    } else {
      // si no hay nada guardado, nos aseguramos de forzar el valor inicial correcto
      setForm({
        fecha: fechaInicial,
        periodo: periodoInicial,
        empresa: form.empresa,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveStorage])

  // Cada vez que cambie `form`, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem(claveStorage, JSON.stringify(form))
  }, [form, claveStorage])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Texto que irá dentro del PDF (y que vimos en la vista previa)
  const textoParaPDF = `
BUENOS AIRES ${form.fecha}
Dirección General Políticas Asistenciales para Personas Mayores
De mi consideración:

Según su pedido, enviamos cotización por el servicio de lavado, planchado, retiro y entrega
de ropa de cama y ropa de cuerpo, con un servicio diario.

El servicio tiene un valor total para el mes de ${form.periodo} para los hogares que
se detallan según su solicitud:

Hogar San Martín: $12.925.000  
Hogar Rawson: $10.975.000  

Monto final cotizado para el mes de ${form.periodo} es de pesos
Novecientos Mil ($23.900.000).
  `.trim()

  // Buscamos la ruta de la imagen de fondo según la empresa seleccionada
  const fondoSeleccionado = empresas.find((e) => e.nombre === form.empresa)?.fondo

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Selección de empresa destinataria */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Empresa destinataria:
        </label>
        <select
          name="empresa"
          value={form.empresa}
          onChange={handleChange}
          className="w-full border rounded p-2 text-sm"
        >
          {empresas.map((e) => (
            <option key={e.nombre} value={e.nombre}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Inputs: fecha y período */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de emisión:
          </label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="border rounded p-2 w-full text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período (mes activo):
          </label>
          <input
            type="text"
            name="periodo"
            value={form.periodo}
            onChange={handleChange}
            className="border rounded p-2 w-full text-sm"
            placeholder="Ej: ABRIL 2025"
          />
        </div>
      </div>

      {/* Vista previa del texto dentro de un contenedor */}
      <div className="border rounded p-4 bg-white whitespace-pre-wrap text-sm leading-relaxed shadow-sm">
        <pre>{textoParaPDF}</pre>
      </div>

      {/* Botón para activar vista previa / descarga de PDF */}
      <div className="flex justify-start">
        <Button
          onClick={() => {
            if (!form.fecha || !form.periodo) {
              alert('Debes completar la fecha y el período antes de generar el PDF.')
              return
            }
            setMostrarPDF(true)
          }}
          className="bg-green-600 text-white"
        >
          Vista previa / Descargar PDF
        </Button>
      </div>

      {/* Si el usuario pide ver el PDF, lo mostramos en un contenedor scrollable */}
      {mostrarPDF && (
        <div className="mt-4 border rounded overflow-auto" style={{ height: '600px' }}>
          {fondoSeleccionado ? (
            <PresupuestoPdfRichard texto={textoParaPDF} fondo={fondoSeleccionado} />
          ) : (
            <p className="text-red-600 p-4">
              No se encontró la imagen de fondo para la empresa seleccionada.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
