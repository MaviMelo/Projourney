// src/app.tsx

import { Routes, Route } from 'react-router-dom';


// Importa os componentes de página existentes
import Layout from './components/layout/layout'
import HomePage from './pages/homePage';
import CadastrarPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import TrilhasPage from './pages/trailsPage';
import PerfilPage from './pages/profilePage';
import AulasPage from './pages/classesPage';
import { CoursesPage, CourseDetailPage } from './pages/coursesPage';
import SobrePage from './pages/aboutPage';
import { BrowserRouter } from 'react-router-dom';

import AccessibilityToolbar from './components/acessibilities/AcessibilityToolbar';
import VLibras from './components/acessibilities/VLibras';

function MyRoutes() {
  return (
    // Wrap the siblings in a Fragment
    <>

      <BrowserRouter basename="/spa">  {/* redefine a base URL para http://<domínio>/spa para configuração do proxy reverso no Docker*/}

        <AccessibilityToolbar />
        <VLibras />

        <Routes>
          {/* ATENÇÃO: Os paths devem ser URLs, não nomes de arquivos */}
          <Route path="/cadastrar" element={<CadastrarPage />} /> {/* Rota para a página de cadastro */}
          <Route path="/login" element={<LoginPage />} /> {/* Rota para a página de login */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} /> {/* rota para ... */}
            <Route path="/cursos" element={<CoursesPage />} />
            <Route path="/cursos/:id" element={<CourseDetailPage />} />
            <Route path="/trilhas" element={<TrilhasPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/aulas/:trailId" element={<AulasPage />} />
            <Route path="/sobre" element={<SobrePage />} />
          </Route>
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default MyRoutes;