import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, initAuth } from '@/lib/api';
import { User, BookOpen, MoreVertical, Loader2, AlertCircle, CheckCircle, LogOut, Trash2 } from "lucide-react";
import { LogoutButton } from "@/components/effects/logout";

// --- Interfaces para Tipagem dos Dados ---
interface User {
    id: number;
    name: string;
    email: string;
}

interface Trail {
    id: number;
    name: string;
    progress: 'Inscrito' | 'Cursando' | 'Suspenso' | 'Concluído';
    pivot: {
        id: number;
        progress: 'Inscrito' | 'Cursando' | 'Suspenso' | 'Concluído';
    };
}

// Mapeamento de cores para os status
const statusColors: { [key: string]: string } = {
    Inscrito: 'bg-blue-700/20 text-blue-300 border-blue-500/30',
    Cursando: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Suspenso: 'bg-gray-100/20 text-gray-300 border-gray-500/30',
    Concluído: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export default function PerfilPage(): React.JSX.Element {
    const navigate = useNavigate();

    // --- Estados do Componente ---
    const [user, setUser] = useState<User | null>(null);
    const [trails, setTrails] = useState<Trail[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'idle' | 'error'>('loading');
    const [feedback, setFeedback] = useState<string>('');
    const [alert, setAlert] = useState<{ status: string, message: string } | null>(null);

    // --- Função para disparar alertas (Fora de qualquer outro hook/função) ---
    const showAlert = (status: string, message: string) => {
        setAlert({ status, message });
        setTimeout(() => setAlert(null), 5000);
    };

    // --- Função para Buscar Dados do Perfil ---
    useEffect(() => {
        initAuth();
        const userData = localStorage.getItem('loggedUser');

        if (!userData) {
            navigate('/login');
            return; // Se não houver usuário
        }
        const loggedUser: User = JSON.parse(userData);
        setUser(loggedUser); // Define o usuário no estado

        // Função interna para buscar os dados
        const loadProfileData = async () => {
            setStatus('loading');
            try {
                const response = await apiFetch('/profile');

                if (response.status !== 'success') {
                    if (response.data === 401 || response.data === 403) {
                        window.alert("Sua sessão expirou ou é inválida. Faça login novamente.");
                        localStorage.removeItem('loggedUser');
                        navigate('/login');
                        return;
                    }
                    throw new Error(response.message || 'Falha ao carregar dados do perfil.');
                }
                const data = response.data as { user: { trails: Trail[] }, status: 'loading' | 'success' | 'idle' | 'error', message: string };
                setTrails(data.user.trails || []);
                setStatus(data.status);
                showAlert(data.status, data.message);

            } catch (err) {
                setFeedback(err instanceof Error ? err.message : 'Erro desconhecido.');
                setStatus('error');
            }
        };

        loadProfileData();

    }, [navigate]);


    // --- Função para Atualizar o Progresso ---
    const handleProgressoChange = async (pivotId: number, newProgress: Trail['progress']) => {
        if (!user) return;

        const oldTrail = [...trails];
        const alreadyUpdate = trails.find(t => t.pivot.id === pivotId);
        if (alreadyUpdate && alreadyUpdate.pivot.progress === newProgress) { return };


        try {
            const response = await apiFetch(`/trailUser/${pivotId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    user_id: user.id,
                    // pivot_id: pivotId,
                    progress: newProgress,
                }),
            });

            if (response.status !== 'success') throw new Error('Falha ao atualizar o progresso.');

            const result = response.data as { progress: Trail['progress'], status: string, message: string };

            // Otimização: Atualiza a UI para exibir o dado atializado sem recarregar o componente pelo loadProfileData() (request mais cara).
            setTrails(trails.map(t => t.pivot.id === pivotId ? { ...t, pivot: { ...t.pivot, progress: result.progress } } : t));

            showAlert(result.status, result.message);

        } catch (err) {
            showAlert("error", "Não foi possível atualizar o progresso!");
            setTrails(oldTrail);
        }
    };

    const handleDelete = async (trail: Trail) => {
        window.confirm("Tem certeza que deseja excluir esta trilha?");

        try {
            const response = await apiFetch(`/trailUser/${trail.pivot.id}`, {
                method: 'DELETE',
            });
            const result = response.data as { status: string, message: string };
            if (response.status !== 'success') throw new Error(result.message || 'Falha ao excluir a trilha.');

            // Exibir mensagem de sucesso
            showAlert("success", result.message);

            setTrails(trails.filter(t => t.id !== trail.id));
        } catch (err) {
            showAlert(err instanceof Error ? err.message : "error", "Erro ao excluir trilha.");
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
            </div>
        );
    }

    if (status === 'error' || !user) {
        return (
            <div className="centralize">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h1 className="textCard">Ocorreu um Erro</h1>
                <p className="warningError">{feedback || "Não foi possível carregar os dados do perfil."}</p>
                <button onClick={() => navigate('/login')} className="buttonPrimary">Voltar para o Login</button>
            </div>
        );
    }

    return (

        <>
            <div className="max-w-6xl mx-auto p-4 sm:p-8">
                {/* Cabeçalho do Perfil */}

                <header className="itemsJustify">
                    <div>
                        <h1 className="title text-5xl">Olá, {user.name.split(' ')[0]}!</h1>
                        <p className="">Aqui está o resumo da sua jornada de aprendizado.</p>
                    </div>

                    <LogoutButton />

                </header>
                {alert && (
                    <div className={`${alert.status === 'error' ? 'warningError' : 'warningSuccess'}`}>
                        {alert.message}
                    </div>
                )}


                {/* Seção de Trilhas */}
                <section>
                    <h2 className="textCard itemsJustify2">
                        <BookOpen className="text-blue-400" />
                        Minhas Trilhas
                    </h2>

                    {trails.length > 0 ? (
                        <div className="containerGrid ">
                            {trails.map(trail => (
                                <div key={trail.id} className="card1">
                                    <div>
                                        <h3 className="textCard3">
                                            <Link
                                                to={`/aulas/${trail.id}`}
                                                className="textLink"
                                            >
                                                {trail.name}
                                            </Link>
                                        </h3>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[trail.pivot.progress]}`}>
                                            {trail.pivot.progress}
                                        </div>
                                    </div>
                                    <div className="mt-6 relative">
                                        <details className="group">
                                            <summary className=" itemsJustify2 justify-end textLink">
                                                <span>Alterar Status</span>
                                                <MoreVertical size={20} />
                                            </summary>
                                            <div className=" dropDown centralize2">
                                                {Object.keys(statusColors).map(statusKey => (
                                                    <button
                                                        key={statusKey}
                                                        onClick={(e) => {
                                                            handleProgressoChange(trail.pivot.id, statusKey as Trail['progress']);
                                                            (e.target as HTMLElement).closest('details')?.removeAttribute('open');
                                                        }}
                                                        className="centralize2 linkGreen"
                                                    >
                                                        {statusKey}
                                                    </button>
                                                ))}
                                            </div>
                                        </details>
                                        <button
                                            className="itemsJustify linkRed"
                                            onClick={() => handleDelete(trail)}
                                        >
                                            Excluir
                                            <Trash2 />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className=" centralize card2">
                            <h3 className="textCard2">Você ainda não se inscreveu em nenhuma trilha.</h3>
                            <p className="">Que tal começar uma nova jornada?</p>
                            <Link to="/trilhas" className="buttonOutline">
                                Explorar Trilhas
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}