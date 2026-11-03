import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ExternalLink, Clock, Building, User, BookOpen, BarChart } from 'lucide-react';
import ParticleBackground from "@/components/effects/particleBackground";

// Tipos
interface Course {
  id: number;
  category: string;
  title: string;
  description: string;
  duration: string;
  institution: string;
  instructor: string;
  image: string;
  level: string;
}

// Mapeamento de categoria → classe de cor (definida em globals.css)
const categoryClass: Record<string, string> = {
  'Tecnologia': 'catTecnologia',
  'Data Science': 'catDataScience',
  'Inteligência Artificial': 'catIA',
  'Programação': 'catProgramacao',
};

const getCategoryClass = (category: string): string => categoryClass[category] || 'catDataScience';

// Mock de dados dos cursos
const mockCourses: Course[] = [
  {
    id: 1,
    category: 'Tecnologia',
    title: 'Desenvolvimento Web Full Stack',
    description: 'Aprenda a criar aplicações web modernas com React, Node.js e bancos de dados. Domine as ferramentas mais exigidas pelo mercado.',
    duration: '120h',
    institution: 'IFRS - Campus Porto Alegre',
    instructor: 'Prof. Dr. João Silva',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    level: 'Intermediário',
  },
  {
    id: 2,
    category: 'Data Science',
    title: 'Ciência de Dados com Python',
    description: 'Domine análise de dados, machine learning e visualização com Python. Transforme dados complexos em decisões de negócios.',
    duration: '80h',
    institution: 'IFSC - Campus Florianópolis',
    instructor: 'Prof. Dra. Maria Santos',
    image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2070&auto=format&fit=crop',
    level: 'Avançado',
  },
  {
    id: 3,
    category: 'Inteligência Artificial',
    title: 'Introdução à Inteligência Artificial',
    description: 'Fundamentos de IA, algoritmos e aplicações práticas. Dê os primeiros passos na tecnologia que está moldando o futuro.',
    duration: '60h',
    institution: 'UFMG - Campus Belo Horizonte',
    instructor: 'Prof. Dr. Carlos Oliveira',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    level: 'Iniciante',
  },
  {
    id: 4,
    category: 'Programação',
    title: 'Desenvolvimento Mobile com React Native',
    description: 'Crie aplicativos móveis multiplataforma com React Native. Escreva o código uma vez e rode no iOS e Android.',
    duration: '100h',
    institution: 'IFSP - Campus São Paulo',
    instructor: 'Prof. Ana Costa',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop',
    level: 'Intermediário',
  }
];

// --- COMPONENTE: Card do Curso ---
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="partnerCard">

      {/* Imagem com Efeito de Zoom */}
      <div className="partnerCardMedia">
        <img
          src={course.image}
          alt={course.title}
          className="partnerCardImg"
        />
        {/* Badges Flutuantes */}
        <div className="partnerCardBadges">
          <span className={`catBadge ${getCategoryClass(course.category)}`}>
            {course.category}
          </span>
          <span className="levelBadgeDark">
            {course.level}
          </span>
        </div>
      </div>

      {/* Informações do Curso */}
      <div className="partnerCardBody">
        <h3 className="partnerCardTitle">
            {course.title}
        </h3>
        <p className="partnerCardDesc">
            {course.description}
        </p>

        {/* Ícones de Detalhes */}
        <div className="partnerCardMeta">
          <div className="partnerCardMetaRow">
            <Clock size={15} className="partnerCardMetaIcon" />
            <span>{course.duration}</span>
          </div>
          <div className="partnerCardMetaRow">
            <Building size={15} className="partnerCardMetaIcon" />
            <span className="partnerCardMetaText">{course.institution}</span>
          </div>
        </div>

        {/* Botão de Ação - área clicável limitada ao botão */}
        <Link
          to={`/cursos/${course.id}`}
          className="partnerCardAction"
        >
          Ver Detalhes
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};

// --- PÁGINA: Lista de Cursos ---
export const CoursesPage: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('loggedUser');

  return (
    <>
      <ParticleBackground />
      <div className="coursesPage">

        {/* Botão Voltar */}
        <div className="pageTopBar">
            <Link
                to={isAuthenticated ? "/perfil" : "/"}
                className="navBackLink"
            >
                <ArrowLeft size={20} />
                Voltar ao Início
            </Link>
        </div>

        <div className="coursesHeader">
            <div className="coursesHeaderIconBox">
                <BookOpen size={40} />
            </div>
            <div>
                <h1 className="coursesHeaderTitle">Cursos Parceiros</h1>
                <p className="coursesHeaderText">Explore capacitações extras publicadas por instituições de ensino parceiras.</p>
            </div>
        </div>

        {/* Grid de Cursos */}
        <main className="coursesGrid">
          {mockCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </main>
      </div>
    </>
  );
};

// --- PÁGINA: Detalhes do Curso ---
export const CourseDetailPage: React.FC = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const courseId = parseInt(id || '0');
    const foundCourse = mockCourses.find(c => c.id === courseId);
    if (foundCourse) setCourse(foundCourse);
  }, [id]);

  if (!course) {
    return (
      <>
        <ParticleBackground />
        <div className="stateWrap">
          <AlertCircle className="stateIcon" />
          <h1 className="stateTitle">Curso não encontrado</h1>
          <p className="stateText">O curso que você está procurando não está disponível ou foi removido.</p>
          <Link to="/cursos" className="btnPrimary">
            <ArrowLeft size={20} />
            Voltar para a lista
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <ParticleBackground />
      <main className="courseDetailPage">

        {/* Botão Voltar */}
        <div className="pageTopBar">
          <Link
            to="/cursos"
            className="navBackLink"
          >
            <ArrowLeft size={20} />
            Voltar para lista de cursos
          </Link>
        </div>

        {/* Card Principal de Detalhes */}
        <div className="courseDetailCard">

          <div className="courseDetailMedia">
            <img
              src={course.image}
              alt={course.title}
              className="courseDetailImg"
            />
            <div className="courseDetailOverlay"></div>
          </div>

          {/* Conteúdo */}
          <div className="courseDetailBody">

            <div className="courseDetailBadges">
              <span className={`catBadgeLg ${getCategoryClass(course.category)}`}>
                {course.category}
              </span>
              <span className="levelBadge">
                {course.level}
              </span>
            </div>

            <h1 className="courseDetailTitle">
                {course.title}
            </h1>

            <p className="courseDetailDesc">
                {course.description}
            </p>

            {/* Grid de Informações Detalhadas */}
            <div className="courseDetailInfoGrid">

              <div className="courseDetailInfoCard">
                <div className="courseDetailInfoHead">
                    <Clock size={20} />
                    <h3>Duração</h3>
                </div>
                <p className="courseDetailInfoValue">{course.duration}</p>
              </div>

              <div className="courseDetailInfoCard">
                <div className="courseDetailInfoHead">
                    <Building size={20} />
                    <h3>Instituição</h3>
                </div>
                <p className="courseDetailInfoValue">{course.institution}</p>
              </div>

              <div className="courseDetailInfoCard">
                <div className="courseDetailInfoHead">
                    <User size={20} />
                    <h3>Instrutor</h3>
                </div>
                <p className="courseDetailInfoValue">{course.instructor}</p>
              </div>

              <div className="courseDetailInfoCard">
                <div className="courseDetailInfoHead">
                    <BarChart size={20} />
                    <h3>Nível</h3>
                </div>
                <p className="courseDetailInfoValue">{course.level}</p>
              </div>
            </div>

            <div className="courseDetailCta">
              <p className="courseDetailCtaText">
                Confira mais detalhes sobre este curso no site oficial da instituição de ensino parceira.
              </p>
              {/* <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="btnPrimary whitespace-nowrap"
              >
                <span>Acessar Portal Oficial</span>
                <ExternalLink size={20} />
              </a> */}
            </div>

          </div>
        </div>
      </main>
    </>
  );
};