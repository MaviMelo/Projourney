import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, ExternalLink, Clock, Building, User, BookOpen, BarChart } from 'lucide-react';
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

// Função de utilidade para cores das categorias (Ajustado para tons mais modernos)
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Tecnologia': 'bg-blue-600',
    'Data Science': 'bg-purple-600',
    'Inteligência Artificial': 'bg-emerald-600',
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
    <div className="!bg-white dark:!bg-[#1a1a1a]/90 backdrop-blur-md border border-gray-200 dark:border-gray-700/60 shadow-lg rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      
      {/* Imagem com Efeito de Zoom */}
      <div className="relative overflow-hidden h-48">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badges Flutuantes */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`${getCategoryColor(course.category)} text-white font-semibold px-3 py-1 rounded-full text-xs shadow-md`}>
            {course.category}
          </span>
          <span className="bg-black/60 backdrop-blur-md text-white font-semibold px-3 py-1 rounded-full text-xs shadow-md">
            {course.level}
          </span>
        </div>
      </div>
      
      {/* Informações do Curso */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold !text-gray-900 dark:!text-white mb-2 line-clamp-2 group-hover:text-[hsl(var(--button-2))] dark:group-hover:text-blue-400 transition-colors">
            {course.title}
        </h3>
        <p className="!text-gray-600 dark:!text-gray-400 text-sm mb-6 line-clamp-2 flex-1">
            {course.description}
        </p>
        
        {/* Ícones de Detalhes */}
        <div className="flex flex-col gap-2 mb-6 text-sm font-medium !text-gray-700 dark:!text-gray-300">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[hsl(var(--button-2))] dark:text-blue-400" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building size={16} className="text-[hsl(var(--button-2))] dark:text-blue-400" />
            <span className="truncate">{course.institution}</span>
          </div>
        </div>
        
        {/* Botão de Ação */}
        <Link
          to={`/cursos/${course.id}`}
          className="w-full py-3 rounded-lg font-bold text-white bg-[hsl(var(--button-1))] hover:bg-[hsl(var(--button-1-foreground))] shadow-md transition-all flex justify-center items-center gap-2"
        >
          Ver Detalhes
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
      <div className="max-w-7xl mx-auto p-4 sm:p-8 min-h-[calc(100vh-80px)] relative z-10 flex flex-col">
        
        {/* Botão Voltar */}
        <div className="mb-6 mt-4">
            <Link 
                to={isAuthenticated ? "/perfil" : "/"} 
                className="inline-flex items-center gap-2 text-[hsl(var(--button-2))] hover:text-[hsl(var(--button-2-foreground))] font-semibold transition-colors"
            >
                <ArrowLeft size={20} />
                Voltar ao Início
            </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10 pb-6 border-b border-gray-300 dark:border-gray-700/50">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/40 rounded-2xl w-fit">
                <BookOpen className="text-purple-600 dark:text-purple-400 w-10 h-10" />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-bold !text-black-900">Cursos Parceiros</h1>
                <p className="!text-black-500 text-lg mt-2">Explore capacitações extras publicadas por instituições de ensino parceiras.</p>
            </div>
        </div>

        {/* Grid de Cursos */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 relative z-10">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold !text-black-900 mb-2">Curso não encontrado</h1>
          <p className="text-red-600 dark:text-red-400 font-medium mb-6">O curso que você está procurando não está disponível ou foi removido.</p>
          <Link to="/cursos" className="bg-[hsl(var(--button-1))] hover:bg-[hsl(var(--button-1-foreground))] text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
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
      <main className="max-w-5xl mx-auto p-4 sm:p-8 min-h-[calc(100vh-80px)] relative z-10 flex flex-col">
        
        {/* Botão Voltar */}
        <div className="mb-6 mt-4">
          <Link 
            to="/cursos" 
            className="inline-flex items-center gap-2 text-[hsl(var(--button-2))] hover:text-[hsl(var(--button-2-foreground))] font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar para lista de cursos
          </Link>
        </div>

        {/* Card Principal de Detalhes */}
        <div className="!bg-white dark:!bg-[#1a1a1a]/90 backdrop-blur-md border border-gray-200 dark:border-gray-700/60 rounded-3xl overflow-hidden shadow-2xl">
          
          <div className="w-full h-64 sm:h-80 relative">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          
          {/* Conteúdo */}
          <div className="p-8 sm:p-12">
            
            <div className="mb-6 flex flex-wrap gap-2">
              <span className={`${getCategoryColor(course.category)} text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-sm`}>
                {course.category}
              </span>
              <span className="bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 font-bold px-4 py-1.5 rounded-full text-sm shadow-sm border border-gray-300 dark:border-gray-700">
                {course.level}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold !text-gray-900 dark:!text-white mb-6">
                {course.title}
            </h1>
            
            <p className="!text-gray-700 dark:!text-gray-300 text-lg mb-10 leading-relaxed">
                {course.description}
            </p>
            
            {/* Grid de Informações Detalhadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              
              <div className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex items-center gap-2 text-[hsl(var(--button-2))] dark:text-blue-400 font-bold">
                    <Clock size={20} />
                    <h3>Duração</h3>
                </div>
                <p className="!text-gray-800 dark:!text-gray-200 font-medium">{course.duration}</p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex items-center gap-2 text-[hsl(var(--button-2))] dark:text-blue-400 font-bold">
                    <Building size={20} />
                    <h3>Instituição</h3>
                </div>
                <p className="!text-gray-800 dark:!text-gray-200 font-medium">{course.institution}</p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex items-center gap-2 text-[hsl(var(--button-2))] dark:text-blue-400 font-bold">
                    <User size={20} />
                    <h3>Instrutor</h3>
                </div>
                <p className="!text-gray-800 dark:!text-gray-200 font-medium">{course.instructor}</p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex items-center gap-2 text-[hsl(var(--button-2))] dark:text-blue-400 font-bold">
                    <BarChart size={20} />
                    <h3>Nível</h3>
                </div>
                <p className="!text-gray-800 dark:!text-gray-200 font-medium">{course.level}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl gap-6">
              <p className="text-gray-700 dark:text-gray-300 font-medium text-center sm:text-left">
                Confira mais detalhes sobre este curso no site oficial da instituição de ensino parceira.
              </p>
              {/* <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap px-8 py-4 rounded-xl font-bold text-white bg-[hsl(var(--button-1))] hover:bg-[hsl(var(--button-1-foreground))] shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
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