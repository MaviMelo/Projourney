/*
 *
 * configuração Vite
 *
*/

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importa o módulo 'path' do Node.js

export default defineConfig({
  plugins: [react()],
  base: '/spa', // define a base URL do projeto para facilitar a separação de rotas no proxy reverso, de acordo com a estrutura definida no doker com Nginx.
  root: './',  // define a raiz do projeto para o vite.
  build: {
    outDir: 'dist', // onde os arquivos de build serão gerados
  },
  publicDir: 'public',
  resolve: { 
    alias: {
      '@': path.resolve(__dirname, './src'), // Mapeia @/ para o diretório src
    },
  },
});
