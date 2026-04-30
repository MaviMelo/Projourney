import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InteractiveButton from '../components/common/interactive-button';
import ParticleBackground from '@/components/effects/particlebackground';
import SimpleLink from "../components/common/simpleLink";
import { Loader2, AlertCircle, ArrowLeft, ExternalLink, LogOut } from 'lucide-react';

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

// Função de utilidade para cores das categorias
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Tecnologia': 'bg-blue-600',
    'Data Science': 'bg-purple-600',
    'Inteligência Artificial': 'bg-green-600',
    'Programação': 'bg-pink-600'
  };
  return colors[category] || 'bg-purple-600';
};

// Mock de dados dos cursos
const mockCourses: Course[] = [
  {
    id: 1,
    category: 'Tecnologia',
    title: 'Desenvolvimento Web Full Stack',
    description: 'Aprenda a criar aplicações web modernas com React, Node.js e bancos de dados',
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
    description: 'Domine análise de dados, machine learning e visualização com Python',
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
    description: 'Fundamentos de IA, algoritmos e aplicações práticas',
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
    description: 'Crie aplicativos móveis multiplataforma com React Native',
    duration: '100h',
    institution: 'IFSP - Campus São Paulo',
    instructor: 'Prof. Ana Costa',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop',
    level: 'Intermediário',
  }
];

// Componente do Card do Curso
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="card1">

      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`${getCategoryColor(course.category)} text-white px-3 py-1 rounded-full text-sm`}>
            {course.category}
          </span>
          <span className="bg-blue-900/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm">
            {course.level}
          </span>
        </div>
      </div>
      <div>
        <h3 className="title">{course.title}</h3>
        <p className=" itemsJustify">{course.description}</p>
        <div className=" itemsJustify">
          <span>{course.duration}</span>
          <span>{course.institution}</span>
        </div>
        <div className=" itemsJustify">
          <span>{course.instructor}</span>
          <InteractiveButton
            href={`/cursos/${course.id}`}
            variant="primary"
            as="link"
          >
            Ver Detalhes
          </InteractiveButton>
        </div>
      </div>
    </div>
  );
};

// Página de Detalhes do Curso
export const CourseDetailPage: React.FC = () => {
  const { id } = useParams();
  const [course, setCourse] = React.useState<Course | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const courseId = parseInt(id || '0');
    const foundCourse = mockCourses.find(c => c.id === courseId);

    if (foundCourse) {
      setCourse(foundCourse);
    }
  }, [id]);

  if (!course) {
    return (
      <div className="itemsJustify">
        <div className="text-center">
          <div className="title">Não há curso publicado recentemente.</div>
          <InteractiveButton
            href="/cursos"
            className="text-center"
            variant="primary"
            as="link"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para lista de cursos
          </InteractiveButton>
        </div>
      </div>
    );
  }

  return (
    <>
      <ParticleBackground />
      {/* Header */}
      <header className="header z-[40]">

        <h1 className="title">Cursos Publicados</h1>
        <nav>
          {localStorage.getItem('usuarioLogado') ? (
            <SimpleLink to="/perfil" variant="navLink">
              <ArrowLeft className="w-5 h-5" />
              Início
            </SimpleLink>
          ) : (
            <SimpleLink to="/" variant="navLink">
              <ArrowLeft className="w-5 h-5" />
              Início
            </SimpleLink>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="centralize">
        <InteractiveButton
          href="/cursos"
          className="itemsJustify"
          variant="navLink"
          as="link"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para lista de cursos
        </InteractiveButton>

        <div className="card1">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <div className="mb-4 flex gap-2">
              <span className={`${getCategoryColor(course.category)} text-white px-3 py-1 rounded-full text-sm`}>
                {course.category}
              </span>
              <span className="bg-blue-900/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm">
                {course.level}
              </span>
            </div>
            <h1 className="title">{course.title}</h1>
            <p className="">{course.description}</p>
            <div className="containerGrid">
              <div className="elementeCard1">
                <h3 className="textCard2">Duração</h3>
                <p>{course.duration}</p>
              </div>
              <div className="elementeCard1">
                <h3 className="textCard2">Instituição</h3>
                <p>{course.institution}</p>
              </div>
              <div className="elementeCard1">
                <h3 className="textCard2">Instrutor</h3>
                <p>{course.instructor}</p>
              </div>
              <div className="elementeCard1">
                <h3 className="textCard2">Nível</h3>
                <p>{course.level}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <p> Confira mais detalhes sobre este curso no site oficial da instituição de ensino.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// Página Principal de Cursos
export const CoursesPage: React.FC = () => {
  return (
    <div>
      <ParticleBackground />
      {/* Header */}
      <header className="header z-[40]">

        <h1 className="title">Cursos Publicados</h1>
        <nav>
          {localStorage.getItem('usuarioLogado') ? (
            <SimpleLink to="/perfil" variant="navLink">
              <ArrowLeft className="w-5 h-5" />
              Início
            </SimpleLink>
          ) : (
            <SimpleLink to="/" variant="navLink">
              <ArrowLeft className="w-5 h-5" />
              Início
            </SimpleLink>
          )}
        </nav>

      </header>

      {/* Main Content */}
      <main className="containerGrid">
        {mockCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </main>
    </div>
  );
}; 
