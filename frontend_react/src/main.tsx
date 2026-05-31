// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app'; // componente pricipal (raiz) da aplicação
import './assets/globals.css'; // folha de estilização (CSS) global
import { ThemeProvider } from './components/effects/themeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>  {/* Comente para teste rápido (elimina duplicidade de dados no console do browser/DevTools) */}
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,   // Após debugar descomentar para criação de código mais robusto.
);
