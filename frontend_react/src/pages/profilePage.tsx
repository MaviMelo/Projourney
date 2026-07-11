// src/pages/perfilPage.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "@/config/api";
import { BookOpen, MoreVertical, Loader2, AlertCircle, CheckCircle, Trash2, Plus } from "lucide-react"; // Importado o Plus aqui

// --- Interfaces para Tipagem dos Dados ---
interface User {
    id: number;
    name: string;
    email: string;
}

interface Trail {
    id: number;
    name: string;
    pivot: {
        id: number;
        progress: 'Inscrito' | 'Cursando' | 'Suspenso' | 'Concluído';
    };
}

const statusColors: { [key: string]: string } = {
    Inscrito: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-500/30',
    Cursando: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/40 dark:text-yellow-300 border-yellow-500/30',
    Suspenso: 'bg-gray-200 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300 border-gray-500/30',
    Concluído: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-500/30',
};

export default function PerfilPage(): React.JSX.Element {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [trails, setTrails] = useState<Trail[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'idle' | 'error'>('loading');
    const [feedback, setFeedback] = useState<string>('');
    const [alert, setAlert] = useState<{ status: string, message: string } | null>(null);

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
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return; 
                };

                const response = await fetch(`${BASE_URL}/profile?email=${encodeURIComponent(loggedUser.email)}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        window.alert("Sua sessão expirou ou é inválida. Faça login novamente.");
                        localStorage.removeItem('token'); 
                        localStorage.removeItem('loggedUser');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Falha ao carregar dados do perfil.');
                }
                const data = await response.json();
                setTrails(data.user.trails || []);
                setStatus('success');
            } catch (err) {
                setFeedback(err instanceof Error ? err.message : 'Erro desconhecido.');
                setStatus('error');
            }
        };

        loadProfileData();
    }, [navigate]);

    const handleProgressoChange = async (pivotId: number, newProgress: Trail['pivot']['progress']) => {
        if (!user) return;
        const oldTrail = [...trails];
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/trailUser/${pivotId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user.id,
                    progress: newProgress,
                }),
            });

            if (!response.ok) throw new Error('Falha ao atualizar o progresso.');
            
            setTrails(trails.map(t => t.pivot.id === pivotId ? { ...t, pivot: { ...t.pivot, progress: newProgress } } : t));
            showAlert('success', 'Progresso atualizado com sucesso!');

        } catch (err) {
            showAlert("error", "Não foi possível atualizar o progresso!");
            setTrails(oldTrail);
        }
    };

    const handleDelete = async (trail: Trail) => {
        if(!window.confirm("Tem certeza que deseja excluir esta trilha?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/trailUser/${trail.pivot.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Falha ao excluir a trilha.');

            showAlert("success", "Trilha excluída com sucesso.");
            setTrails(trails.filter(t => t.id !== trail.id));
        } catch (err) {
            showAlert("error", err instanceof Error ? err.message : "Erro ao excluir trilha.");
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-[hsl(var(--button-2))] animate-spin" />
            </div>
        );
    }

    if (status === 'error' || !user) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-3xl font-bold !text-gray-900 dark:!text-gray-100 mb-2">Ocorreu um Erro</h1>
                <p className="text-red-600 dark:text-red-400 font-medium mb-6">{feedback || "Não foi possível carregar os dados do perfil."}</p>
                <button onClick={() => navigate('/login')} className="bg-[hsl(var(--button-1))] hover:bg-[hsl(var(--button-1-foreground))] text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Voltar para o Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8 min-h-[calc(100vh-80px)] relative z-10">
            
            {/* Cabeçalho do Perfil */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 mt-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold !text-black-900 mb-2">
                        Olá, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="!text-black-700 text-lg">
                        Aqui está o resumo da sua jornada de aprendizado.
                    </p>
                </div>
            </header>

            {/* Alertas Flutuantes */}
            {alert && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 font-medium shadow-md border ${
                    alert.status === 'error' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'
                }`}>
                    {alert.status === 'error' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                    {alert.message}
                </div>
            )}

            {/* Seção de Trilhas */}
            <section>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-300 dark:border-gray-700/50">
                    <BookOpen className="text-[hsl(var(--button-2))] dark:text-blue-400 w-8 h-8" />
                    <h2 className="text-3xl font-bold !text-black-900">
                        Minhas Trilhas
                    </h2>
                </div>

                {trails.length > 0 ? (
                    /* Alterado aqui: Envolvendo a estrutura em uma div flex para alinhar o botão no final */
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trails.map(trail => (
                                <div key={trail.id} className="!bg-white dark:!bg-[#1a1a1a]/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
                                    
                                    {/* Topo do Card */}
                                    <div>
                                        <Link to={`/aulas/${trail.id}`} className="block text-xl font-bold !text-gray-900 dark:!text-white hover:!text-[hsl(var(--button-2))] dark:hover:!text-blue-400 transition-colors mb-4">
                                            {trail.name}
                                        </Link>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColors[trail.pivot.progress]}`}>
                                            {trail.pivot.progress}
                                        </span>
                                    </div>

                                    {/* Base do Card */}
                                    <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700/50 pt-4">
                                        
                                        <details className="group relative">
                                            <summary className="flex items-center gap-1 text-sm font-medium !text-gray-600 dark:!text-gray-400 hover:!text-blue-600 dark:hover:!text-blue-400 cursor-pointer list-none transition-colors">
                                                <span>Alterar Status</span>
                                                <MoreVertical size={16} />
                                            </summary>
                                            
                                            <div className="absolute bottom-full left-0 mb-2 w-40 !bg-white dark:!bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-20 hidden group-open:block">
                                                {Object.keys(statusColors).map(statusKey => (
                                                    <button
                                                        key={statusKey}
                                                        onClick={(e) => {
                                                            handleProgressoChange(trail.pivot.id, statusKey as Trail['pivot']['progress']);
                                                            (e.target as HTMLElement).closest('details')?.removeAttribute('open');
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm !text-gray-700 dark:!text-gray-200 hover:!bg-gray-100 dark:hover:!bg-gray-700 transition-colors"
                                                    >
                                                        {statusKey}
                                                    </button>
                                                ))}
                                            </div>
                                        </details>
                                        
                                        <button
                                            onClick={() => handleDelete(trail)}
                                            className="flex items-center gap-1 text-sm font-medium !text-red-600 dark:!text-red-400 hover:!text-red-800 dark:hover:!text-red-300 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* NOVO: Botão de Mais Trilhas condicional (aparece apenas quando trails.length > 0) */}
                        <div className="flex justify-center mt-4">
                            <Link 
                                to="/trilhas" 
                                className="inline-flex items-center gap-2 border-2 border-[hsl(var(--button-2))] text-[hsl(var(--button-2))] hover:bg-[hsl(var(--button-2))] hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-950 font-bold py-3 px-8 rounded-full transition-all shadow-md hover:scale-105 active:scale-95"
                            >
                                <Plus size={18} />
                                <span>Adicionar Mais Trilhas</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Estado vazio (Mantido intacto) */
                    <div className="flex flex-col items-center justify-center !bg-white dark:!bg-[#1a1a1a]/80 backdrop-blur-md border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center shadow-lg">
                        <h3 className="text-2xl font-bold !text-gray-900 dark:!text-white mb-2">Você ainda não se inscreveu em nenhuma trilha.</h3>
                        <p className="!text-gray-600 dark:!text-gray-400 mb-6">Que tal começar uma nova jornada agora mesmo?</p>
                        <Link to="/trilhas" className="bg-transparent border-2 border-[hsl(var(--button-2))] text-[hsl(var(--button-2))] hover:bg-[hsl(var(--button-2))] hover:text-white font-bold py-3 px-8 rounded-full transition-all">
                            Explorar Trilhas
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}