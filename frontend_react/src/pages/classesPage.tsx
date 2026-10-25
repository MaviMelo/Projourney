import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ExternalLink, ArrowLeft, GraduationCap, PlayCircle, BookX, Plus } from 'lucide-react';
import { apiFetch, initAuth } from '@/lib/api';
import ParticleBackground from "@/components/effects/particleBackground";
import StarRatingPage from '@/components/layout/StarRatingPage';
import CommentList from '@/components/layout/CommentList';

export interface Course {
    id: number;
    name: string;             // varchar(150) no banco
    level: 'básico' | 'intermediário' | 'avançado';
    link_course: string;      // varchar(250) no banco
    user_id: number | null;
    is_custom?: boolean;      // Gerado pelo accessor getIsCustomAttribute
    created_at?: string;
    updated_at?: string;
}

export default function AulasPage(): React.JSX.Element {
    const navigate = useNavigate();
    const { trailId } = useParams<{ trailId: string }>(); 
    const [courses, setCourses] = useState<Course[]>([]);
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
    
    // 1. Estados para o Modal e para identificar se a trilha é personalizada
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isCustomTrail, setIsCustomTrail] = useState<boolean>(false);
    const [novoCurso, setNovoCurso] = useState({ name: '', link: '' });

    useEffect(() => {
        initAuth();
        const loggedUser = localStorage.getItem('loggedUser');
        if (!loggedUser) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (!trailId) return;

        const fetchCursos = async () => {
            try {
                const response = await apiFetch(`/trail/${trailId}`);
                
                if (response.status !== 'success') {
                    throw new Error(`Erro do Servidor: ${response.message}`);
                }

                // 2. Ajuste conforme o retorno da sua API (ex: response.data.trail.is_custom)
                const result = response.data as { trail: { courses: Course[]; is_custom?: boolean } };
                setCourses(result.trail.courses);
                setIsCustomTrail(result.trail.is_custom ?? false);
                setStatus('success');

            } catch (error) {
                console.error("Erro ao buscar cursos:", error);
                setStatus('error');
            }
        };

        fetchCursos();
    }, [trailId]);

    // Função para lidar com a criação do curso personalizado
    const handleCreateCustomCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica de envio para a API...
        setIsOpenModal(false);
        setNovoCurso({ name: '', link: '' });
    };

    if (status === 'loading') {
        return (
            <>
                <ParticleBackground />
                <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative z-10">
                    <Loader2 className="w-16 h-16 text-[hsl(var(--button-2))] animate-spin" />
                </div>
            </>
        );
    }

    if (status === 'error') {
        return (
            <>
                <ParticleBackground />
                <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 relative z-10">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h1 className="text-3xl font-bold !text-gray-900 dark:!text-gray-100 mb-2">Ocorreu um Erro</h1>
                    <p className="text-red-600 dark:text-red-400 font-medium mb-6">Não foi possível carregar os cursos desta trilha.</p>
                    <Link to="/perfil" className="bg-[hsl(var(--button-1))] hover:bg-[hsl(var(--button-1-foreground))] text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Voltar para o Perfil
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <ParticleBackground />

            <main className="max-w-5xl mx-auto p-4 sm:p-8 min-h-[calc(100vh-80px)] relative z-10 flex flex-col">
                
                <div className="mb-6 mt-4 flex justify-between items-center">
                    <Link 
                        to="/perfil" 
                        className="inline-flex items-center gap-2 text-[hsl(var(--button-2))] hover:text-[hsl(var(--button-2-foreground))] font-semibold transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Voltar para Minhas Trilhas
                    </Link>

                    {/* 3. Exibir botão de adicionar aula apenas se for trilha personalizada */}
                    {isCustomTrail && (
                        <button
                            onClick={() => setIsOpenModal(true)}
                            className="flex items-center gap-2 bg-[hsl(var(--button-2))] hover:opacity-90 text-white font-bold py-2 px-4 rounded-xl transition-all"
                        >
                            <Plus size={20} />
                            Adicionar Aula
                        </button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10 pb-6 border-b border-gray-300 dark:border-gray-700/50">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-2xl w-fit">
                        <GraduationCap className="text-[hsl(var(--button-2))] dark:text-blue-400 w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold !text-black-900">Conteúdo da Trilha</h1>
                        <p className="!text-black-700 text-lg mt-2">Acesse as aulas abaixo e expanda seus conhecimentos.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {courses.length > 0 ? (
                        courses.map(course => (
                          <React.Fragment key={course.id}>
                            <a
                                href={course.link_course}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 !bg-white dark:!bg-[#1a1a1a]/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] hover:border-[hsl(var(--button-2))] dark:hover:border-blue-400 cursor-pointer"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 text-[hsl(var(--button-2))] dark:text-blue-400 group-hover:bg-[hsl(var(--button-2))] group-hover:text-white dark:group-hover:bg-blue-500 transition-colors">
                                        <PlayCircle className="w-8 h-8" />
                                    </div>
                                    <div className="flex flex-col justify-center gap-2">
                                        <h3 className="text-2xl font-bold !text-gray-900 dark:!text-white group-hover:text-[hsl(var(--button-2))] dark:group-hover:text-blue-300 transition-colors">
                                            {course.name}
                                        </h3>
                                        <span className="w-fit inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600 uppercase tracking-wider">
                                            {course.level}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[hsl(var(--button-2))] dark:text-blue-400 font-bold group-hover:translate-x-2 transition-transform self-end sm:self-auto mt-4 sm:mt-0 px-4 py-2 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                                    <span>Acessar Aula</span>
                                    <ExternalLink size={20} />
                                </div>
                            </a>
                            <div onClick={(e) => e.stopPropagation()} className="mt-2">
                                <StarRatingPage Courseid={course.id} />
                            </div>
                            <CommentList Courseid={course.id} />
                          </React.Fragment>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center !bg-white dark:!bg-[#1a1a1a]/80 backdrop-blur-md border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center shadow-lg">
                            <BookX className="w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-2xl font-bold !text-gray-900 dark:!text-white mb-2">Nenhuma aula encontrada</h3>
                            <p className="!text-gray-600 dark:!text-gray-400">Ainda não existem conteúdos cadastrados para esta trilha.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* 4. Modal de Adicionar Curso/Link renderizado condicionalmente */}
            {isOpenModal && isCustomTrail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Adicionar Novo Curso/Link</h3>
                        
                        <form onSubmit={handleCreateCustomCourse} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Curso</label>
                                <input 
                                    type="text" 
                                    required
                                    value={novoCurso.name}
                                    onChange={(e) => setNovoCurso({ ...novoCurso, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    placeholder="Ex: Arquitetura Limpa"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link de Acesso</label>
                                <input 
                                    type="url" 
                                    required
                                    value={novoCurso.link}
                                    onChange={(e) => setNovoCurso({ ...novoCurso, link: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsOpenModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-[hsl(var(--button-2))] text-white font-bold rounded-lg transition-all"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
