import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { RemitoProvider } from './context/RemitoContext';
import { CaratulaProvider } from './context/CaratulaContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CaratulaProvider>
      <RemitoProvider>
        <App />
      </RemitoProvider>
    </CaratulaProvider>
  </React.StrictMode>
);
