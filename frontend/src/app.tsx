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
import SobrePage from './pages/sobrePage';

function App() {
    return (
        <Routes>
            {/* ATENÇÃO: Os paths devem ser URLs, não nomes de arquivos */}
            <Route path="/cadastrar" element={<CadastrarPage />} /> {/* Rota para a página de cadastro */}
            <Route path="/login" element={<LoginPage />} /> {/* Rota para a página de login */}
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} /> {/* Rota para a página inicial */}
                <Route path="/cursos" element={<CoursesPage />} /> {/* Rota para a página de cursos */}
                <Route path="/cursos/:id" element={<CourseDetailPage />} /> {/* Rota para detalhes do curso */}
                <Route path="/trilhas" element={<TrilhasPage />} />
                <Route path="/perfil" element={<PerfilPage />} />
                <Route path="/aulas/:trilhaId" element={<AulasPage />} />
                <Route path="/sobre" element={<SobrePage />} />
            </Route>
        </Routes>
    );
}

export default App;
