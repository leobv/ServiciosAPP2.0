// src/main.jsx (o index.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RemitoProvider } from './context/RemitoContext';
import { EmailProvider } from './context/EmailContext';
import { CaratulaProvider } from './context/CaratulaContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RemitoProvider>
      <CaratulaProvider>
        <EmailProvider>
          <App />
        </EmailProvider>
      </CaratulaProvider>
    </RemitoProvider>
  </React.StrictMode>
);
