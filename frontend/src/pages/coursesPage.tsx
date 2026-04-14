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
  isEnrolled: boolean;
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
    isEnrolled: false
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
    isEnrolled: false
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
    isEnrolled: false
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
    isEnrolled: false
  }
];

// Componente do Card do Curso
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-800/40 backdrop-blur-md border border-blue-500/30 rounded-lg overflow-hidden hover:bg-blue-800/40 transition-colors">

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
        {course.isEnrolled && (
          <div className="absolute top-4 right-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
              Inscrito
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
        <p className="text-gray-300 mb-4">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
          <span>{course.duration}</span>
          <span>{course.institution}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">{course.instructor}</span>
          <InteractiveButton
            href={`/cursos/${course.id}`}
            variant="primary"
          >
            {course.isEnrolled ? 'Acessar curso' : 'Ver detalhes'}
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

  const handleEnrollment = () => {
    if (course) {
      setCourse({
        ...course,
        isEnrolled: true
      });
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen  flex items-center justify-center font-['Poppins',Arial,sans-serif]">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Curso não encontrado</div>
          <InteractiveButton
            href="/cursos"
            variant="primary"
          >
            Voltar para lista de cursos
          </InteractiveButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white overflow-x-hidden font-['Poppins',Arial,sans-serif]">
      <ParticleBackground />
      {/* Header */}
      <header className="bg-blue-901/40 backdrop-blur-md border-b border-blue-500/30 px-[90px] py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mx-auto">
          <h1 className="text-2xl font-bold text-white">Cursos Publicados</h1>
          <nav className="flex items-center justify-between space-x-6">
            <div className="flex items-center space-x-4">
              {localStorage.getItem('usuarioLogado') ? (
                <SimpleLink to="/perfil" variant="nav" className="text-white">
                  <ArrowLeft className="w-5 h-5" />
                  Início
                </SimpleLink>
              ) : (
                <SimpleLink to="/" variant="nav">
                  Início
                </SimpleLink>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-12">
        <InteractiveButton
          href="/cursos"
          variant="nav"
          className="mb-6"
        >
          ← Voltar para lista de cursos
        </InteractiveButton>

        <div className="bg-blue-900/40 backdrop-blur-md border border-blue-500/30 rounded-lg overflow-hidden">
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
              {course.isEnrolled && (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  Inscrito
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
            <p className="text-gray-300 text-lg mb-6">{course.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-900/20 backdrop-blur-md border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Duração</h3>
                <p className="text-gray-300">{course.duration}</p>
              </div>
              <div className="bg-blue-900/20 backdrop-blur-md border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Instituição</h3>
                <p className="text-gray-300">{course.institution}</p>
              </div>
              <div className="bg-blue-900/20 backdrop-blur-md border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Instrutor</h3>
                <p className="text-gray-300">{course.instructor}</p>
              </div>
              <div className="bg-blue-900/20 backdrop-blur-md border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Nível</h3>
                <p className="text-gray-300">{course.level}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <p> Confira mais detalhes sobre este curso no site oficial da instituição de ensino.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Página Principal de Cursos
export const CoursesPage: React.FC = () => {
  return (
    <div className=" text-white font-['Poppins',Arial,sans-serif]">
      <ParticleBackground />
      {/* Header */}
      <header className="bg-blue-900/40 backdrop-blur-md border-b border-blue-500/30 px-[90px] py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mx-auto">
          <h1 className="text-2xl font-bold text-[#00aaff]">Cursos Publicados</h1>
          <nav className="flex items-center justify-between space-x-6">
            <div className="flex items-center space-x-4">
              {localStorage.getItem('usuarioLogado') ? (
                <SimpleLink to="/perfil" variant="nav">
                  <ArrowLeft className="w-5 h-5" />
                  Início
                </SimpleLink>
              ) : (
                <SimpleLink to="/" variant="nav">
                  Início
                </SimpleLink>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </div>
  );
}; 
