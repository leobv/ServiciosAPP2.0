import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RemitoProvider } from './context/RemitoContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RemitoProvider>
      <App />
    </RemitoProvider>
  </React.StrictMode>
);
