import { createContext, useContext, useState } from 'react';

// Creamos el contexto (named export por si en algún lugar necesitás
// acceder directamente al objeto Context).
export const CaratulaContext = createContext(null);

export function CaratulaProvider({ children }) {
  // Estado inicial: intenta leer la carátula activa del localStorage
  const [caratula, setCaratula] = useState(() => {
    try {
      const raw = localStorage.getItem('caratula_activa');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Función para “activar” una carátula concreta
  const seleccionarCaratula = (datos) => {
    const activa = {
      hogar: datos.hogar,
      mes: datos.mes,
      expediente: datos.expediente,
      servicio: datos.servicio || '',
    };
    setCaratula(activa);
    localStorage.setItem('caratula_activa', JSON.stringify(activa));
  };

  // Función para “desactivar” o limpiar la carátula
  const limpiarCaratula = () => {
    setCaratula(null);
    localStorage.removeItem('caratula_activa');
  };

  return (
    <CaratulaContext.Provider
      value={{ caratula, seleccionarCaratula, limpiarCaratula }}
    >
      {children}
    </CaratulaContext.Provider>
  );
}

// Hook simplificado para consumir el contexto
export function useCaratula() {
  const context = useContext(CaratulaContext);
  if (context === undefined) {
    throw new Error('useCaratula debe usarse dentro de CaratulaProvider');
  }
  return context;
}
