import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {BASE_URL} from "@/config/api";
import { User, BookOpen, MoreVertical, Loader2, AlertCircle, CheckCircle, LogOut, Trash2 } from "lucide-react";
import {LogoutButton} from "@/components/effects/logout";

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
}

// Mapeamento de cores para os status
const statusColors: { [key: string]: string } = {
    Inscrito: 'bg-blue-700/20 text-blue-300 border-blue-500/30',
    Cursando: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Suspenso: 'bg-gray-100/20 text-gray-300 border-gray-500/30',
    Concluido: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export default function PerfilPage(): React.JSX.Element {
    const navigate = useNavigate();

    // --- Estados do Componente ---
    const [user, setUser] = useState<User | null>(null);
    const [trails, setTrails] = useState<Trail[]>([]);
    const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
    const [feedback, setFeedback] = useState<string>('');
    const [alert, setAlert] = useState<{ message: string} | null>(null);

    // --- Função para disparar alertas (Fora de qualquer outro hook/função) ---
    const showAlert = (message: string) => {
        setAlert({ message});
        setTimeout(() => setAlert(null), 5000);
    };

    // --- Função para Buscar Dados do Perfil ---
    useEffect(() => {
        const userData = localStorage.getItem('loggedUser');
        
        // debug
        // console.log(userData);
        
        if (!userData) {
            navigate('/login');
            return; // Se não houver usuário
        }
        const loggedUser: User = JSON.parse(userData);
        setUser(loggedUser); // Define o usuário no estado
        
        // debug
        // console.log(loggedUser);
        // console.log(JSON.stringify(userData, null, 2));

        // Função interna para buscar os dados
        const loadProfileData = async () => {
            setStatus('loading');
            try {

                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return; // Se não houver token (mesmo que já tenha verificado antes)
                };

                const response = await fetch(`${BASE_URL}/profile?email=${encodeURIComponent(loggedUser.email)}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        window.alert("Sua sessão expirou ou é inválida. Faça login novamente.");
                        localStorage.removeItem('token'); // Limpa o token inválido
                        localStorage.removeItem('loggedUser');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Falha ao carregar dados do perfil.');
                }
                const data = await response.json();
                setTrails(data.user.trails || []);
                setStatus(data.status);
                showAlert(data.message);

            } catch (err) {
                setFeedback(err instanceof Error ? err.message : 'Erro desconhecido.');
                setStatus('error');
            }
        };

        loadProfileData();

    }, [navigate]);


    // --- Função para Atualizar o Progresso ---
    const handleProgressoChange = async (trailId: number, novoProgresso: Trail['progress']) => {
        if (!user) return;

        // Otimização: Atualiza a UI primeiro para uma resposta mais rápida
        const trailsAntigas = [...trails];
        setTrails(trails.map(t => t.id === trailId ? { ...t, progress: novoProgresso } : t));

        try {
            const response = await fetch(`${BASE_URL}/atualizar_progresso.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alunoId: user.id,
                    trailId: trailId,
                    progress: novoProgresso,
                }),
            });
            if (!response.ok) throw new Error('Falha ao atualizar o progresso.');
        } catch (err) {
            showAlert("Não foi possível atualizar o progresso.", "error");
            setTrails(trailsAntigas);
        }
    };

    const handleDelete = async (trailId: number) => {
        if (!window.confirm("Tem certeza que deseja excluir esta trilha?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/delete_user_trail.php?trilhaId=${trailId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Falha ao excluir a trilha.');

            // Exibir mensagem de sucesso
            showAlert(result.message || "Trilha excluída com sucesso.", "success");

            setTrails(trails.filter(t => t.id !== trailId));
        } catch (err) {
            showAlert(err instanceof Error ? err.message : "Erro ao excluir trilha.", "error");
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
                    <div className={`${alert.type === 'error' ? 'warningError' : 'warningSuccess'}`}>
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
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[trail.progress]}`}>
                                            {trail.progress}
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
                                                            handleProgressoChange(trail.id, statusKey as Trail['progress']);
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
                                            onClick={() => handleDelete(trail.id)}
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

