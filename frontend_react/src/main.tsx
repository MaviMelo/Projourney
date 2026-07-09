// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import MyRoutes from './router';
import './assets/globals.css'; // folha de estilização (CSS) global
import { ThemeProvider } from './components/effects/themeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>  {/* Comente para teste rápido (elimina duplicidade de dados no console do browser/DevTools) */}
      <ThemeProvider>
        <MyRoutes />
      </ThemeProvider>
  </React.StrictMode>,   // Após debugar descomentar para criação de código mais robusto.
);
