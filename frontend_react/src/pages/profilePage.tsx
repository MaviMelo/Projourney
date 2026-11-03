import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from '@/lib/api';
import { BookOpen, AlertCircle, CheckCircle, Trash2, Plus } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Course {
    id: number;
    name: string;
    level?: string;
    link_course?: string;
}

interface Trail {
    id: number;
    name: string;
    user_id: number | null; 
    courses?: Course[];
    pivot?: {
        id: number;
        progress: 'Inscrito' | 'Cursando' | 'Suspenso' | 'Concluído';
    };
}

const statusClasses: { [key: string]: string } = {
    Inscrito: 'statusInscrito',
    Cursando: 'statusCursando',
    Suspenso: 'statusSuspenso',
    Concluído: 'statusConcluido',
};

export default function PerfilPage(): React.JSX.Element {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [trails, setTrails] = useState<Trail[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'idle' | 'error'>('loading');
    const [feedback, setFeedback] = useState<string>('');
    const [alert, setAlert] = useState<{ status: string, message: string } | null>(null);
    const [newTrailName, setNewTrailName] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);
  const showAlert = (status: string, message: string) => {
        setAlert({ status, message });
        setTimeout(() => setAlert(null), 5000);
    };

    useEffect(() => {
        const userData = localStorage.getItem('loggedUser');
        if (!userData) {
            navigate('/login');
            return; 
        }
        const loggedUser: User = JSON.parse(userData);
        setUser(loggedUser); 

        const loadProfileData = async () => {
            setStatus('loading');
            try {
                const response = await apiFetch('/todocourse');

                if (response.status !== 'success') {
                    throw new Error(response.message || 'Falha ao carregar dados do perfil.');
                }
                
                // Extração direta ajustada para o formato { user, trails } retornado pelo controller
                const responseData = response.data as { user?: User; trails?: Trail[] };
                
                if (responseData?.user) {
                    setUser(responseData.user);
                }
                
                setTrails(responseData?.trails || []);
                setStatus('success');
                
            } catch (err) {
                setFeedback(err instanceof Error ? err.message : 'Erro desconhecido.');
                setStatus('error');
            }
        };

        loadProfileData();
    }, [navigate]);

    // Função de criação da trilha
    const handleCreateTrail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTrailName.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await apiFetch('/trail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTrailName }),
            });

            if (response.status !== 'success') {
                throw new Error(response.message || 'Erro ao criar a trilha.');
            }
        
        // 1. Acessa os dados reais da model retornados dentro de response.data.data
        const responseBody = response.data as { data?: Trail; message?: string };
        const newTrailData = responseBody?.data;

        if (!newTrailData) {
            throw new Error('Dados da trilha não foram retornados pelo servidor.');
        }

        // O backend retorna os dados da trilha em response.data
        const createdTrail: Trail = {
            id: newTrailData.id,
            name: newTrailData.name,
            user_id: newTrailData.user_id,
            courses: [],
            pivot: { 
                id: 0, 
                progress: 'Inscrito' 
            }
        };

            setTrails(prev => [createdTrail, ...prev]);
            setNewTrailName('');
            showAlert("success", response.message || "Trilha criada com sucesso!");
        } catch (err) {
            showAlert("error", err instanceof Error ? err.message : "Erro ao criar trilha.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Altera o status (progress) da inscrição do usuário na trilha
    const handleStatusChange = async (trail: Trail, newProgress: string) => {
        const pivotId = trail.pivot?.id;
        if (!pivotId) return;

        setStatusUpdatingId(pivotId);
        try {
            const response = await apiFetch(`/trail-users/${pivotId}`, {
                method: 'PUT',
                body: JSON.stringify({ progress: newProgress }),
            });

            if (response.status !== 'success') {
                throw new Error(response.message || 'Falha ao atualizar o status.');
            }

            setTrails(prev => prev.map(t =>
                t.id === trail.id && t.pivot
                    ? { ...t, pivot: { ...t.pivot, progress: newProgress as NonNullable<Trail['pivot']>['progress'] } }
                    : t
            ));
            showAlert("success", "Status atualizado com sucesso.");
        } catch (err) {
            showAlert("error", err instanceof Error ? err.message : "Erro ao atualizar o status.");
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const handleDelete = async (trail: Trail) => {
        // 1. Trilha personalizada do próprio usuário → exclui a trilha inteira.
        if (trail.user_id !== null) {
            if (!window.confirm("Tem certeza que deseja excluir sua trilha personalizada?")) return;

            try {
                const response = await apiFetch(`/trail/${trail.id}`, { method: 'DELETE' });

                if (response.status !== 'success') {
                    throw new Error(response.message || 'Falha ao excluir a trilha.');
                }

                showAlert("success", response.message || "Trilha excluída com sucesso.");
                setTrails(prev => prev.filter(t => t.id !== trail.id));
            } catch (err) {
                showAlert("error", err instanceof Error ? err.message : "Erro ao excluir trilha.");
            }
            return;
        }

        // 2. Trilha do sistema → remove apenas a inscrição (tabela pivô),
        //    preservando a trilha em si para os demais usuários.
        const pivotId = trail.pivot?.id;
        if (!pivotId) {
            showAlert("error", "Não foi possível identificar sua inscrição nesta trilha.");
            return;
        }

        if (!window.confirm("Tem certeza que deseja remover esta trilha do seu perfil?")) return;

        try {
            const response = await apiFetch(`/trail-users/${pivotId}`, { method: 'DELETE' });

            if (response.status !== 'success') {
                throw new Error(response.message || 'Falha ao remover a inscrição.');
            }

            showAlert("success", response.message || "Trilha removida com sucesso.");
            setTrails(prev => prev.filter(t => t.id !== trail.id));
        } catch (err) {
            showAlert("error", err instanceof Error ? err.message : "Erro ao remover trilha.");
        }
    };

    if (status === 'loading') {
        return (
            <div className="stateWrap">
                <div className="stateSpinner" />
            </div>
        );
    }

    if (status === 'error' || !user) {
        return (
            <div className="stateWrap">
                <AlertCircle className="stateIcon" />
                <h1 className="stateTitle">
                    Ocorreu um Erro (provavelmente tempo de seção esgotado).
                    Por favor faça login novamente.
                </h1>
                <p className="stateText">{feedback}</p>
                <button onClick={() => navigate('/login')} className="btnPrimary">
                    Voltar para o Login
                </button>
            </div>
        );
    }

    return (
        <div className="pageContainer">
            <header className="pageHeader">
                <div>
                    <h1 className="pageHeaderTitle">
                        Olá, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="pageHeaderText">
                        Aqui estão suas trilhas do sistema e personalizadas.
                    </p>
                </div>
            </header>

            {alert && (
                <div className={`alert ${alert.status === 'error' ? 'alertError' : 'alertSuccess'}`}>
                    {alert.status === 'error' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                    {alert.message}
                </div>
            )}
            {/* Form de Criação de Trilha */}
            <form onSubmit={handleCreateTrail} className="inputBar">
                <input
                    type="text"
                    value={newTrailName}
                    onChange={(e) => setNewTrailName(e.target.value)}
                    placeholder="Nome da nova trilha personalizada..."
                    className="inputPlain"
                    disabled={isSubmitting}
                    required
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !newTrailName.trim()}
                    className="btnPrimary"
                >
                    {isSubmitting ? <div className="btnSpinner" /> : <Plus size={20} />}
                    Criar Trilha
                </button>
            </form>
            <section>
                <div className="sectionHeader">
                    <BookOpen className="sectionIcon" />
                    <h2 className="sectionTitle">Minhas Trilhas</h2>
                </div>

                {trails.length > 0 ? (
                    <div className="cardGrid">
                        {trails.map(trail => (
                            <div key={trail.id} className="itemCard">
                                <div>
                                    <div className="itemCardTop">
                                        <span className={`badge ${trail.user_id === null ? 'badgeSystem' : 'badgeCustom'}`}>
                                            {trail.user_id === null ? 'Sistema' : 'Personalizada'}
                                        </span>

                                        {trail.pivot ? (
                                            <select
                                                value={trail.pivot.progress}
                                                onChange={(e) => handleStatusChange(trail, e.target.value)}
                                                disabled={statusUpdatingId === trail.pivot.id}
                                                title="Alterar status da trilha"
                                                className={`statusBadge ${statusClasses[trail.pivot.progress]}`}
                                            >
                                                <option value="Inscrito">Inscrito</option>
                                                <option value="Cursando">Cursando</option>
                                                <option value="Suspenso">Suspenso</option>
                                                <option value="Concluído">Concluído</option>
                                            </select>
                                        ) : (
                                            <span className={`statusBadge ${statusClasses['Inscrito']}`}>
                                                Inscrito
                                            </span>
                                        )}
                                    </div>
                                    <Link to={`/aulas/${trail.id}`} className="itemCardTitle">
                                        {trail.name}
                                    </Link>

                                    {/* Listagem dos Cursos da Trilha */}
                                    <div className="itemCardBody">
                                        <p className="itemCardLabel">Cursos da Trilha:</p>
                                        {trail.courses && trail.courses.length > 0 ? (
                                            <ul className="itemList">
                                                {trail.courses.map(course => (
                                                    <li key={course.id}>
                                                        {course.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="itemCardEmpty">Nenhum curso associado ainda.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="itemCardFooter">
                                    <Link to={`/aulas/${trail.id}`} className="itemCardLink">
                                        Acessar Trilha
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(trail)}
                                        className="btnTextDanger"
                                    >
                                        <Trash2 size={16} />
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="emptyState">
                        <h3 className="emptyStateTitle">Nenhuma trilha encontrada.</h3>
                    </div>
                )}
            </section>
        </div>
    );
}
