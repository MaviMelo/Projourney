import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ExternalLink, ArrowLeft, GraduationCap, PlayCircle, BookX, Plus, Trash2 } from 'lucide-react';
import { apiFetch, initAuth } from '@/lib/api';
import ParticleBackground from "@/components/effects/particleBackground";
import StarRatingPage from '@/components/layout/StarRatingPage';
import CommentList from '@/components/layout/CommentList';

export interface Course {
    id: number;
    name: string;
    level: 'básico' | 'intermediário' | 'avançado';
    link_course: string;
    pivot?: {
        id: number;
    };
}

export default function AulasPage(): React.JSX.Element {
    const navigate = useNavigate();
    const { trailId } = useParams<{ trailId: string }>(); 
    const [courses, setCourses] = useState<Course[]>([]);
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isCustomTrail, setIsCustomTrail] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Form states
    const [newCourseName, setNewCourseName] = useState<string>('');
    const [newCourseLink, setNewCourseLink] = useState<string>('');
    const [newCourseLevel, setNewCourseLevel] = useState<'básico' | 'intermediário' | 'avançado'>('básico');

    useEffect(() => {
        initAuth();
        const loggedUser = localStorage.getItem('loggedUser');
        if (!loggedUser) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchCursos = useCallback(async () => {
        if (!trailId) return;
        try {
            const response = await apiFetch(`/trail/${trailId}`);

            if (response.status !== 'success' || !response.data) {
                throw new Error(`Erro do Servidor: ${response.message || 'Falha ao carregar'}`);
            }

            // A leitura se ajusta ao JSON { status: "success", trail: { ... } }
            const rawData = response.data as any;
            const trail = rawData?.trail ?? rawData?.data?.trail;

            if (!trail) {
                console.error("Payload retornado da API sem a propriedade 'trail':", rawData);
                throw new Error('Dados da trilha não foram encontrados no payload.');
            }

            setCourses(trail.courses || []);
            // Aceita tanto o booleano 'is_custom' enviado pelo controller quanto 'user_id'
            setIsCustomTrail(trail.is_custom ?? trail.user_id !== null);
            setStatus('success');

        } catch (error) {
            console.error("Erro ao buscar cursos:", error);
            setStatus('error');
        }
    }, [trailId]);

    useEffect(() => {
        fetchCursos();
    }, [fetchCursos]);

    const handleOpenModal = () => {
        setNewCourseName('');
        setNewCourseLink('');
        setNewCourseLevel('básico');
        setSubmitting(false);
        setIsOpenModal(true);
    };

    const handleCloseModal = () => {
        setIsOpenModal(false);
        setSubmitting(false);
    };

    const handleCreateAndAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourseName.trim() || !newCourseLink.trim() || !trailId) return;

        setSubmitting(true);
        try {
            // 1. Cria o curso via POST /course
            const courseResponse = await apiFetch('/course', {
                method: 'POST',
                body: JSON.stringify({
                    name: newCourseName,
                    link_course: newCourseLink,
                    level: newCourseLevel,
                }),
            });

            if (courseResponse.status !== 'success' || !courseResponse.data) {
                alert(courseResponse.message || 'Erro ao criar o curso.');
                setSubmitting(false);
                return;
            }

            // Extrai o id retornado no objeto de resposta do POST /course
            const rawData = courseResponse.data as any;
            const courseId = rawData?.id ?? rawData?.data?.id ?? rawData?.course?.id;

            if (!courseId) {
                console.error("Payload retornado do POST /course sem ID:", courseResponse);
                alert('Erro ao obter o ID do curso criado.');
                setSubmitting(false);
                return;
            }

            // 2. Vincula o curso à trilha via POST /trail-courses
            const linkResponse = await apiFetch('/trail-courses', {
                method: 'POST',
                body: JSON.stringify({
                    trail_id: Number(trailId),
                    course_id: Number(courseId),
                }),
            });

            if (linkResponse.status === 'success') {
                handleCloseModal();
                await fetchCursos();
            } else {
                alert(linkResponse.message || 'Curso criado, mas falhou ao vincular à trilha.');
            }
        } catch (error) {
            console.error("Erro no envio:", error);
            alert('Falha ao comunicar com o servidor.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveCourseFromTrail = async (pivotId: number | undefined) => {
        if (!pivotId) {
            alert("Não foi possível identificar o vínculo para remoção.");
            return;
        }

        if (!confirm("Deseja realmente remover este curso da sua trilha?")) return;

        try {
            const response = await apiFetch(`/trail-courses/${pivotId}`, {
                method: 'DELETE',
            });

            if (response.status === 'success') {
                fetchCursos();
            } else {
                alert(response.message || 'Erro ao remover curso.');
            }
        } catch (error) {
            alert('Falha ao tentar remover o curso.');
        }
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

                    {isCustomTrail && (
                        <button
                            onClick={handleOpenModal}
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
                                <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 !bg-white dark:!bg-[#1a1a1a]/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md transition-all duration-300">
                                    <a
                                        href={course.link_course}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-5 flex-1 cursor-pointer"
                                    >
                                        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 text-[hsl(var(--button-2))] dark:text-blue-400 group-hover:bg-[hsl(var(--button-2))] group-hover:text-white transition-colors">
                                            <PlayCircle className="w-8 h-8" />
                                        </div>
                                        <div className="flex flex-col justify-center gap-2">
                                            <h3 className="text-2xl font-bold !text-gray-900 dark:!text-white group-hover:text-[hsl(var(--button-2))] transition-colors">
                                                {course.name}
                                            </h3>
                                            <span className="w-fit inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600 uppercase tracking-wider">
                                                {course.level}
                                            </span>
                                        </div>
                                    </a>

                                    <div className="flex items-center gap-4 self-end sm:self-auto mt-4 sm:mt-0">
                                        <a
                                            href={course.link_course}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-[hsl(var(--button-2))] font-bold px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                        >
                                            <span>Acessar</span>
                                            <ExternalLink size={18} />
                                        </a>

                                        {isCustomTrail && course.pivot?.id && (
                                            <button
                                                onClick={() => handleRemoveCourseFromTrail(course.pivot?.id)}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                                title="Remover curso da trilha"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
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

            {isOpenModal && isCustomTrail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Criar e Adicionar Aula</h3>
                        
                        <form onSubmit={handleCreateAndAddCourse} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nome do Curso / Aula
                                </label>
                                <input 
                                    type="text"
                                    required
                                    disabled={submitting}
                                    placeholder="Ex: Introdução ao React"
                                    value={newCourseName}
                                    onChange={(e) => setNewCourseName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Link do Curso
                                </label>
                                <input 
                                    type="url"
                                    required
                                    disabled={submitting}
                                    placeholder="https://exemplo.com"
                                    value={newCourseLink}
                                    onChange={(e) => setNewCourseLink(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nível
                                </label>
                                <select 
                                    disabled={submitting}
                                    value={newCourseLevel}
                                    onChange={(e) => setNewCourseLevel(e.target.value as 'básico' | 'intermediário' | 'avançado')}
                                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                >
                                    <option value="básico">Básico</option>
                                    <option value="intermediário">Intermediário</option>
                                    <option value="avançado">Avançado</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={handleCloseModal}
                                    disabled={submitting}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="px-4 py-2 bg-[hsl(var(--button-2))] text-white font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {submitting && <Loader2 size={16} className="animate-spin" />}
                                    Salvar e Vincular
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
