import { createContext, useContext, useState } from 'react';

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [ultimaFechaMailPaso3, setUltimaFechaMailPaso3] = useState(null);

  return (
    <EmailContext.Provider value={{ ultimaFechaMailPaso3, setUltimaFechaMailPaso3 }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmailContext = () => useContext(EmailContext);
