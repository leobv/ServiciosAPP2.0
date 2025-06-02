# 🧾 Generador de Informes para Servicios GCBA

Esta aplicación permite automatizar la generación de textos administrativos y formularios para el proceso de contratación de servicios esenciales (como lavandería) en hogares de residencia dependientes del GCBA.

---

## 🚀 Funcionalidades principales

- ✅ Formularios para cada paso del procedimiento (basado en modelos reales)
- ✅ Generación automática de textos administrativos (PET, informes, mails, etc.)
- ✅ Persistencia por **mes de trabajo** (ej: `abril2025`)
- ✅ Dashboard visual para acceder a cada paso y sus formularios
- ✅ Modal para previsualizar textos generados
- ✅ Opción para borrar los datos y empezar de nuevo

---

## 📁 Estructura por pasos

Cada paso representa una instancia del proceso administrativo. Ejemplos:

| N° | Paso                           | Código         |
|----|--------------------------------|----------------|
| 3  | Solicitud de presupuestos     | `Paso3.jsx`    |
| 7  | Informe técnico                | `Paso7.jsx`    |
| 9  | Inicio de actividades         | `Paso9.jsx`    |
| 11 | Proyecto de Acto Administrativo | `Paso11.jsx` |
| 12 | Informe de Reconocimiento      | `Paso12.jsx` |

Los formularios guardan su estado en `localStorage` bajo la clave:
```
paso{número}_{mesTrabajo}
```
Ejemplo:
```json
{
  "form": {...},
  "texto": "..."
}
```

---

## 📆 Uso por mes

Desde el `Dashboard.jsx`, podés seleccionar o escribir el **mes de trabajo** (ej. `abril2025` o `mayo2025`).

Esto permite:
- Tener múltiples versiones de un mismo paso por mes
- Acceder fácilmente a los informes anteriores

---

## 🧑‍💻 Cómo correr localmente

```bash
# Instalación
npm install

# Levantar el proyecto
npm run dev
```

---

## 📌 Pendientes futuros

- Exportar informes generados como PDF o Word
- Subida de documentación adjunta en pasos específicos
- Autenticación por usuario
- Integración con Vercel y edición online (en progreso)

---

## 🏷 Créditos
Proyecto de automatización de textos administrativos creado por y para optimizar procesos de contratación pública en GCBA.

---

¿Preguntas? ¡Abrí un issue o escribí directamente en el código! ✍️
