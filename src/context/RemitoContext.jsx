import { createContext, useContext, useState } from 'react';

const RemitoContext = createContext();

export const RemitoProvider = ({ children }) => {
  const [remito, setRemito] = useState({
    proveedor: '',
    servicio: '',
    hogares: '',
    mes: '',
  });

  return (
    <RemitoContext.Provider value={{ remito, setRemito }}>
      {children}
    </RemitoContext.Provider>
  );
};

export const useRemito = () => {
  const context = useContext(RemitoContext);
  if (!context) {
    throw new Error('useRemito debe usarse dentro de un RemitoProvider');
  }
  return context;
};
