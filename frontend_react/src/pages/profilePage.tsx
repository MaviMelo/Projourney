import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, initAuth } from '@/lib/api';
import { BookOpen, MoreVertical, Loader2, AlertCircle, CheckCircle, Trash2, Plus } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Trail {
    id: number;
    name: string;
    user_id: number | null; // Identifica se é do sistema (null) ou do usuário
    pivot?: {
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
        initAuth();
        
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
                const response = await apiFetch('/profile');

                if (response.status !== 'success') {
                    throw new Error(response.message || 'Falha ao carregar dados do perfil.');
                }
                
                const data = response.data as { user: { trails: Trail[] } };
                setTrails(data.user.trails || []);
                setStatus('success');
                
            } catch (err) {
                setFeedback(err instanceof Error ? err.message : 'Erro desconhecido.');
                setStatus('error');
            }
        };

        loadProfileData();
    }, [navigate]);

    const handleDelete = async (trail: Trail) => {
        // Se for trilha do sistema (user_id === null), o usuário comum não deve poder excluir
        if (trail.user_id === null) {
            showAlert("error", "Você não pode excluir trilhas oficiais do sistema.");
            return;
        }

        if (!window.confirm("Tem certeza que deseja excluir sua trilha personalizada?")) return;

        try {
            const response = await apiFetch(`/trails/${trail.id}`, {
                method: 'DELETE',
            });
            
            if (response.status !== 'success') throw new Error('Falha ao excluir a trilha.');

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
                <h1 className="text-3xl font-bold mb-2">Ocorreu um Erro</h1>
                <p className="text-red-600 font-medium mb-6">{feedback}</p>
                <button onClick={() => navigate('/login')} className="bg-[hsl(var(--button-1))] text-white font-bold py-3 px-6 rounded-lg">
                    Voltar para o Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8 min-h-[calc(100vh-80px)] relative z-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 mt-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        Olá, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-lg opacity-80">
                        Aqui estão suas trilhas do sistema e personalizadas.
                    </p>
                </div>
            </header>

            {alert && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 font-medium shadow-md border ${
                    alert.status === 'error' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'
                }`}>
                    {alert.status === 'error' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                    {alert.message}
                </div>
            )}

            <section>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-300 dark:border-gray-700/50">
                    <BookOpen className="text-[hsl(var(--button-2))] w-8 h-8" />
                    <h2 className="text-3xl font-bold">Trilhas Disponíveis e Suas</h2>
                </div>

                {trails.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trails.map(trail => (
                            <div key={trail.id} className="bg-white dark:bg-[#1a1a1a]/95 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColors[trail.pivot?.progress ?? 'Inscrito']}`}>
                                          {trail.pivot?.progress ?? 'Inscrito'}
                                        </span>
                                    </div>
                                    <Link to={`/aulas/${trail.id}`} className="block text-xl font-bold hover:text-blue-500 transition-colors mb-4">
                                        {trail.name}
                                    </Link>
                                </div>

                                <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700/50 pt-4">
                                    <Link to={`/aulas/${trail.id}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                        Acessar Trilha
                                    </Link>
                                    
                                    {/* Botão de excluir apenas para trilhas personalizadas do usuário */}
                                    {trail.user_id !== null && (
                                        <button
                                            onClick={() => handleDelete(trail)}
                                            className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            Excluir
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-12 border border-dashed rounded-2xl">
                        <h3 className="text-xl font-bold mb-2">Nenhuma trilha encontrada.</h3>
                    </div>
                )}
            </section>
        </div>
    );
}
