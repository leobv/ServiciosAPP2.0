import { createContext, useContext, useState } from 'react';

// Creamos el contexto (named export por si en algún lugar necesitás
// acceder directamente al objeto Context).
export const CaratulaContext = createContext(null);

export function CaratulaProvider({ children }) {
  // { hogar, mes, expediente, servicio }
  const [caratula, setCaratula] = useState(null);

  // Función para “activar” una carátula concreta
  const seleccionarCaratula = (datos) => {
    setCaratula({
      hogar: datos.hogar,
      mes: datos.mes,
      expediente: datos.expediente,
      servicio: datos.servicio || '',
    });
  };

  // Función para “desactivar” o limpiar la carátula
  const limpiarCaratula = () => {
    setCaratula(null);
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
