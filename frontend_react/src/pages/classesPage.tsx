import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ExternalLink, ArrowLeft, GraduationCap, PlayCircle, BookX, Plus, Trash2, Star, MessageCircle, ChevronDown } from 'lucide-react';
import { apiFetch } from '@/lib/api';
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
    <div className="courseCard">
      {/* Cabeçalho do curso: apenas o botão de chevron alterna a expansão */}
      <div className="courseCardHead">
        <div className="courseCardHeadMain">
          <div className="courseCardIcon">
            <PlayCircle size={24} />
          </div>
          <div>
            <h3 className="courseCardTitle">
              {course.name}
            </h3>
            <span className="courseLevel">
              {course.level}
            </span>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          aria-label="Ver mais detalhes do curso"
          className={`courseCardToggle ${expanded ? 'isOpen' : ''}`}
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Conteúdo expansível: link externo, remover, estrelas e comentários dentro do card */}
      {expanded && (
        <div className="courseCardBody">
          <div className="courseCardActions">
            <a
              href={course.link_course}
              target="_blank"
              rel="noopener noreferrer"
              className="courseCardLink"
            >
              <span>Acessar aula</span>
              <ExternalLink size={16} />
            </a>

            {isCustomTrail && course.pivot?.id && (
              <button
                onClick={() => course.pivot && onRemove(course.pivot.id)}
                className="iconBtnDanger"
                title="Remover curso da trilha"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <div className="courseCardExtra">
            <div className="courseCardField">
              <div className="courseCardFieldLabel">
                <Star size={20} className="iconGold" />
                <span>Avaliar curso</span>
              </div>
              <StarRatingPage Courseid={course.id} />
            </div>
            <div className="courseCardField">
              <div className="courseCardFieldLabel">
                <MessageCircle size={20} className="iconInfo" />
                <span>Comentários</span>
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
                <div className="stateWrap">
                    <div className="stateSpinner" />
                </div>
            </>
        );
    }

    if (status === 'error') {
        return (
            <>
                <ParticleBackground />
                <div className="stateWrap">
                    <AlertCircle className="stateIcon" />
                    <h1 className="stateTitle">Ocorreu um Erro</h1>
                    <p className="stateText">Não foi possível carregar os cursos desta trilha.</p>
                    <Link to="/perfil" className="btnPrimary">
                        Voltar para o Perfil
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <ParticleBackground />

            <main className="pageContainer">
                <div className="pageTopBar">
                    <Link to="/perfil" className="navBackLink">
                        <ArrowLeft size={20} />
                        Voltar para Minhas Trilhas
                    </Link>

                    {isCustomTrail && (
                        <button
                            onClick={handleOpenModal}
                            className="btnSecondary"
                        >
                            <Plus size={20} />
                            Adicionar Aula
                        </button>
                    )}
                </div>

                <div className="sectionHeader">
                    <div className="heroIconBox">
                        <GraduationCap className="sectionIcon" />
                    </div>
                    <div>
                        <h1 className="pageHeaderTitle">Conteúdo da Trilha</h1>
                        <p className="pageHeaderText">Acesse as aulas abaixo e expanda seus conhecimentos.</p>
                    </div>
                </div>

                <div className="courseList">
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
                        <div className="emptyState">
                            <BookX size={64} className="emptyStateIcon" />
                            <h3 className="emptyStateTitle">Nenhuma aula encontrada</h3>
                            <p className="emptyStateText">Ainda não existem conteúdos cadastrados para esta trilha.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal para seleção de cursos do sistema */}
            {isOpenModal && isCustomTrail && (
                <div className="modalOverlay">
                    <div className="modalCard">
                        <h3 className="modalTitle">Adicionar Curso Existente</h3>

                        <form onSubmit={handleAddCourseToTrail} className="modalForm">
                            <div className="modalField">
                                <label className="modalLabel">
                                    Selecione um Curso
                                </label>

                                {loadingAvailable ? (
                                    <div className="modalLoading">
                                        <div className="inlineSpinner" />
                                        <span>Carregando cursos...</span>
                                    </div>
                                ) : (
                                    <select
                                        required
                                        disabled={submitting}
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value)}
                                        className="modalSelect"
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

                            <div className="modalActions">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={submitting}
                                    className="btnGhost"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !selectedCourseId}
                                    className="btnSecondary"
                                >
                                    {submitting && <div className="btnSpinner" />}
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
