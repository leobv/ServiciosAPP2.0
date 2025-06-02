import { createContext, useContext, useEffect, useState } from 'react';

const CaratulaContext = createContext();

export function CaratulaProvider({ children }) {
  const [caratula, setCaratula] = useState(() => {
    const last = localStorage.getItem('caratula_activa');
    return last ? JSON.parse(last) : null;
  });

  useEffect(() => {
    if (caratula) {
      localStorage.setItem('caratula_activa', JSON.stringify(caratula));
    }
  }, [caratula]);

  return (
    <CaratulaContext.Provider value={{ caratula, setCaratula }}>
      {children}
    </CaratulaContext.Provider>
  );
}

export function useCaratula() {
  const context = useContext(CaratulaContext);
  if (!context) {
    throw new Error('useCaratula debe usarse dentro de CaratulaProvider');
  }
  return context;
}
