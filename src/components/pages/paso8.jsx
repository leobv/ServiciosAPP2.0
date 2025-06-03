// src/components/formularios/Paso8.jsx

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCaratula } from '@/context/CaratulaContext'
import { usePasoKey } from '@/hooks/usePasoKey'
import CaratulaActivaBanner from '@/components/CaratulaActivaBanner'

/**
 * Convierte “abril2025” → “ABRIL 2025”
 */
function formatoPeriodo(mes) {
  if (!mes) return ''
  const año = mes.slice(-4)
  const mesTexto = mes.slice(0, mes.length - 4)
  return `${mesTexto.toUpperCase()} ${año}`
}

export default function Paso8() {
  // ----------- 1) Obtenemos la carátula activa ----------- 
  // useCaratula() devuelve { hogar, mes, expediente, remito, monto, servicio } o null si no hay carátula
  const { caratula } = useCaratula()  

  // Si no hay carátula, mostramos mensaje para que el usuario vaya a Paso 1
  if (!caratula) {
    return (
      <div className="p-10 text-center space-y-6">
        <h2 className="text-xl font-semibold text-gray-700">
          No hay una carátula activa seleccionada
        </h2>
        <p className="text-gray-500">
          Debés crear o activar una carátula en el Paso 1 antes de continuar.
        </p>
        <Button onClick={() => window.location.assign('/paso/1')}>
          Ir a Paso 1
        </Button>
      </div>
    )
  }

  // ----------- 2) Obtenemos datos de la carátula ----------- 
  const { expediente: expCaratula, servicio: servCaratula, hogares: hogaresCaratula, mes: mesCaratula } = caratula

  // Convertimos "abril2025" → "ABRIL 2025"
  const periodoInicial = formatoPeriodo(mesCaratula)

  // ----------- 3) Inicializamos estado local ----------- 
  // clavelocal = "paso8_<hogar>_<mes>", p.ej. "paso8_sanmartín_abril2025"
  const STORAGE_KEY = usePasoKey(8)

  const [form, setForm] = useState({
    expediente: expCaratula || '',
    servicio: servCaratula || '',
    hogares: hogaresCaratula || '', // en caso de que caratula tenga lista de hogares
    periodo: periodoInicial,
  })

  const [texto, setTexto] = useState('')

  // ----------- 4) Al montar: cargamos de localStorage si existía algo ----------- 
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setForm(parsed)
      } catch (err) {
        console.error('Error al cargar Paso 8 desde localStorage:', err)
      }
    } else {
      // si no hay guardado, asegurarse de poblar con datos de la carátula
      setForm({
        expediente: expCaratula || '',
        servicio: servCaratula || '',
        hogares: hogaresCaratula || '',
        periodo: periodoInicial,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY])

  // ----------- 5) Cada vez que cambie form, lo guardamos en localStorage ----------- 
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
  }, [form, STORAGE_KEY])

  // ----------- 6) Manejadores de formulario ----------- 
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const generarTexto = (e) => {
    e.preventDefault()

    const resultado = `
NOTA

En relación al expediente ${form.expediente}, mediante el cual la Dirección General de Políticas Asistenciales para Personas Mayores solicita autorización para la contratación del ${form.servicio}, correspondiente al período ${form.periodo}, se deja constancia que esta Subsecretaría toma conocimiento de lo actuado y presta conformidad para la prosecución del trámite administrativo pertinente.

Los hogares involucrados son: ${form.hogares}.

Se remite a los fines de su prosecución.
    `.trim()

    setTexto(resultado)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Banner que muestra cuál es la carátula activa */}
      <CaratulaActivaBanner />

      {/* Formulario */}
      <form className="space-y-4" onSubmit={generarTexto}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expediente:
          </label>
          <Input
            name="expediente"
            value={form.expediente}
            onChange={handleChange}
            placeholder="Código de expediente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servicio:
          </label>
          <Input
            name="servicio"
            value={form.servicio}
            onChange={handleChange}
            placeholder="Tipo de servicio (ej: lavandería)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hogares:
          </label>
          <Input
            name="hogares"
            value={form.hogares}
            onChange={handleChange}
            placeholder="Ej: San Martín y Rawson"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período:
          </label>
          <Input
            name="periodo"
            value={form.periodo}
            onChange={handleChange}
            placeholder="Ej: ABRIL 2025"
          />
        </div>

        <div className="flex justify-start">
          <Button type="submit">Generar Nota</Button>
        </div>
      </form>

      {/* Bloque donde aparece el texto generado */}
      {texto && (
        <div className="mt-4 border rounded p-4 bg-white whitespace-pre-wrap text-sm leading-relaxed shadow-sm">
          <pre>{texto}</pre>
        </div>
      )}
    </div>
  )
}
