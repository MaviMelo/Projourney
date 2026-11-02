import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ExternalLink, ArrowLeft, GraduationCap, PlayCircle, BookX, Plus, Trash2, Star, MessageCircle, ChevronDown } from 'lucide-react';
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

// --- Componente: Card individual do curso (com estado próprio de expansão) ---
const CourseCard: React.FC<{ course: Course; isCustomTrail: boolean; onRemove: (pivotId: number) => void }> = ({ course, isCustomTrail, onRemove }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div key={course.id} className="!bg-white dark:!bg-[#1a1a1a]/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-0 shadow-sm overflow-hidden transition-all duration-300 group">
      {/* Cabeçalho do curso: apenas título e ícone redirecionam (área clicável limitada) */}
      <div className="flex items-center justify-between gap-4 p-5 border-b border-gray-100 dark:border-gray-700/60 cursor-pointer bg-gray-50 dark:bg-gray-900/30">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[hsl(var(--button-2))] dark:text-blue-400 group-hover:bg-[hsl(var(--button-2))] group-hover:text-white transition-colors">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[hsl(var(--button-2))] transition-colors leading-tight">
              {course.name}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600 uppercase tracking-wider">
              {course.level}
            </span>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          aria-label="Ver mais detalhes do curso"
          className="p-2 rounded-lg text-gray-400 hover:text-[hsl(var(--button-2))] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {expanded ? <ChevronDown size={18} className="rotate-180" /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Conteúdo expansível: link externo, remover, estrelas e comentários dentro do card */}
      {expanded && (
        <div className="p-5 pt-4 border-t border-gray-50 dark:border-gray-700/40 bg-white dark:bg-[#1a1a1a]/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <a
              href={course.link_course}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full sm:w-auto text-[hsl(var(--button-2))] font-bold px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <span>Acessar aula</span>
              <ExternalLink size={16} />
            </a>

            {isCustomTrail && course.pivot?.id && (
              <button
                onClick={() => course.pivot && onRemove(course.pivot.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                title="Remover curso da trilha"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avaliar curso</span>
              </div>
              <StarRatingPage Courseid={course.id} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Comentários</span>
              </div>
              <CommentList Courseid={course.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AulasPage(): React.JSX.Element {
    const navigate = useNavigate();
    const { trailId } = useParams<{ trailId: string }>(); 
    const [courses, setCourses] = useState<Course[]>([]);
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isCustomTrail, setIsCustomTrail] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Estados para seleção de curso da lista global
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [loadingAvailable, setLoadingAvailable] = useState<boolean>(false);

    useEffect(() => {
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

            const rawData = response.data as any;
            const trail = rawData?.trail ?? rawData?.data?.trail;

            if (!trail) {
                console.error("Payload retornado da API sem a propriedade 'trail':", rawData);
                throw new Error('Dados da trilha não foram encontrados no payload.');
            }

            setCourses(trail.courses || []);
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

    // Busca todos os cursos via CourseController@index
    const fetchAllSystemCourses = async () => {
        setLoadingAvailable(true);
        try {
            const response = await apiFetch('/course');
            if (response.status === 'success' && response.data) {
                const rawData = response.data as any;
                // Trata { data: { courses: [...] } } conforme CourseController@index
                const list = rawData?.courses ?? rawData?.data?.courses ?? [];
                setAvailableCourses(list);
            }
        } catch (error) {
            console.error("Erro ao carregar lista de cursos:", error);
        } finally {
            setLoadingAvailable(false);
        }
    };

    const handleOpenModal = () => {
        setSelectedCourseId('');
        setSubmitting(false);
        setIsOpenModal(true);
        fetchAllSystemCourses();
    };

    const handleCloseModal = () => {
        setIsOpenModal(false);
        setSubmitting(false);
    };

    // Associa o curso selecionado à trilha chamando TrailCourseController@store
    const handleAddCourseToTrail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseId || !trailId) return;

        setSubmitting(true);
        try {
            const response = await apiFetch('/trail-courses', {
                method: 'POST',
                body: JSON.stringify({
                    trail_id: Number(trailId),
                    course_id: Number(selectedCourseId),
                }),
            });

            if (response.status === 'success') {
                handleCloseModal();
                await fetchCursos();
            } else {
                alert(response.message || 'Erro ao associar curso à trilha.');
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
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Conteúdo da Trilha</h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">Acesse as aulas abaixo e expanda seus conhecimentos.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isCustomTrail={isCustomTrail}
                                onRemove={handleRemoveCourseFromTrail}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-white dark:bg-[#1a1a1a]/80 backdrop-blur-md border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center shadow-lg">
                            <BookX className="w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nenhuma aula encontrada</h3>
                            <p className="text-gray-600 dark:text-gray-400">Ainda não existem conteúdos cadastrados para esta trilha.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal para seleção de cursos do sistema */}
            {isOpenModal && isCustomTrail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Adicionar Curso Existente</h3>
                        
                        <form onSubmit={handleAddCourseToTrail} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Selecione um Curso
                                </label>

                                {loadingAvailable ? (
                                    <div className="flex items-center gap-2 py-4 text-gray-500 justify-center">
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Carregando cursos...</span>
                                    </div>
                                ) : (
                                    <select
                                        required
                                        disabled={submitting}
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                    >
                                        <option value="">-- Escolha um curso --</option>
                                        {availableCourses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.level})
                                            </option>
                                        ))}
                                    </select>
                                )}
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
                                    disabled={submitting || !selectedCourseId}
                                    className="px-4 py-2 bg-[hsl(var(--button-2))] text-white font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {submitting && <Loader2 size={16} className="animate-spin" />}
                                    Vincular à Trilha
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
