import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Database, Shield, Smartphone, Globe, Cpu, Brain, Zap, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import ParticleBackground from "@/components/effects/particleBackground";
import { apiFetch, initAuth } from '@/lib/api';

// --- Interfaces e Mapeamento de Ícones ---
interface Trail {
  id: number;   
  name: string;
}

interface userLogged {
  id: number;
  name: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  "Desenvolvimento Frontend": Globe,
  "Desenvolvimento Backend": Database,
  "Desenvolvimento Mobile": Smartphone,
  "Segurança da Informação": Shield,
  "Ciência de Dados": Brain,
  "DevOps e Cloud": Cpu,
  "Inteligência Artificial": Zap,
  "Desenvolvimento Full Stack": Code,
  "Interconexão e Serviços de Redes (ISR)": Globe,
};

export default function TrailsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [trails, setTrails] = useState<Trail[]>([]);
  const [trailSelected, setTrailSelected] = useState<number | null>(null);
  const [user, setUser] = useState<userLogged | null>(null);
  const [status, setStatus] = useState<'loading' | 'idle' | 'error' | 'success'>('loading');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    initAuth();
    const dataUser = localStorage.getItem('loggedUser');
    
    if (dataUser) {
      setUser(JSON.parse(dataUser));
    } else {
      alert("Você precisa estar logado para acessar esta página.");
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTrails = async () => {
      setStatus('loading');
      setFeedback('');
      
      try {
        const response = await apiFetch('/trail');
        
        if (response.status !== 'success') {
          throw new Error(response.message || 'Não foi possível carregar as trilhas.');
        }
        
        const data = (response.data as { trails: Trail[] })?.trails || [];
        setTrails(data);
        setStatus('idle');
        
      } catch (err) {
        setFeedback(err instanceof Error ? err.message : 'Falha na comunicação com o servidor.');
        setStatus('error');
      }
    };

    fetchTrails();
  }, []);

  // --- Função de Inscrição ---
  const handleInscricao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trailSelected) {
      setFeedback("Por favor, selecione uma trilha para continuar.");
      setStatus('error');
      return;
    }

    if (!user) {
      setFeedback("Erro: Usuário não identificado. Por favor, faça login novamente.");
      setStatus('error');
      return;
    }

    setStatus('loading');
    setFeedback('');

    try {
      const response = await apiFetch('/trailUser', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.id,
          trail_id: trailSelected,
        }),
      });

      if (response.status !== 'success') {
        throw new Error(response.message || 'Erro ao realizar inscrição.');
      }

      setFeedback(response.message || 'Inscrição realizada com sucesso!');
      setStatus('success');

      // Redirecionamento após o sucesso
      setTimeout(() => {
        navigate('/perfil');
      }, 2000);

    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Falha ao realizar inscrição.');
      setStatus('error');
    }
  };

  return (
    <>
      <ParticleBackground />

      <div className="max-w-7xl mx-auto p-4 sm:p-8 min-h-[calc(100vh-80px)] relative z-10 flex flex-col">
        
        {/* Botão Voltar */}
        <div className="mb-6 mt-4">
            <Link 
                to="/perfil" 
                className="inline-flex items-center gap-2 text-[hsl(var(--button-2))] hover:text-[hsl(var(--button-2-foreground))] font-semibold transition-colors"
            >
                <ArrowLeft size={20} />
                Voltar para o Perfil
            </Link>
        </div>

        <main className="flex-1 flex flex-col items-center">
            
            {/* Cabeçalho Principal */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Zap className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />
                    <h1 className="text-4xl md:text-5xl font-bold !text-black-700">
                        Trilhas de Conhecimento
                    </h1>
                </div>
                <p className="!text-black-700 text-lg max-w-2xl mx-auto">
                    Olá, <strong className="text-[hsl(var(--button-2))]">{user?.name.split(' ')[0] || 'aventureiro(a)'}</strong>! Selecione a trilha que mais se alinha com seus objetivos profissionais.
                </p>
            </div>

            <form onSubmit={handleInscricao} className="w-full flex flex-col items-center">
                
                {/* Grid de Trilhas */}
                {status === 'loading' && !trails.length ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-16 h-16 animate-spin text-[hsl(var(--button-2))]" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                        {trails.map((trail) => {
                            const Icon = iconMap[trail.name] || Code;
                            const isSelected = trailSelected === trail.id;
                            
                            return (
                                <div
                                    key={trail.id}
                                    onClick={() => setTrailSelected(trail.id)}
                                    className={`relative flex flex-col items-center text-center gap-4 p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 
                                        ${isSelected 
                                            ? 'border-[hsl(var(--button-2))] dark:border-blue-400 !bg-blue-50/80 dark:!bg-blue-900/40 shadow-xl scale-[1.02]' 
                                            : '!bg-white dark:!bg-[#1a1a1a]/80 border-gray-200 dark:border-gray-700/60 shadow-md hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500'
                                        } backdrop-blur-md`}
                                >
                                    <div className={`p-4 rounded-full ${isSelected ? 'bg-[hsl(var(--button-2))] text-white' : 'bg-gray-100 dark:bg-gray-800 text-[hsl(var(--button-2))] dark:text-blue-400'}`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <span className={`text-xl font-bold ${isSelected ? '!text-[hsl(var(--button-2))] dark:!text-blue-300' : '!text-gray-800 dark:!text-gray-200'}`}>
                                        {trail.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Área de Alertas e Botão de Submit */}
                <div className="mt-12 w-full max-w-md flex flex-col items-center gap-6">
                    
                    {/* Alertas (Altura miníma para não quebrar o layout ao aparecer) */}
                    <div className="min-h-[60px] w-full flex justify-center">
                        {status === 'success' && (
                            <div className="w-full flex items-center justify-center gap-2 p-4 bg-green-100 text-green-700 border border-green-200 dark:border-green-800 rounded-lg font-medium shadow-md">
                                <CheckCircle size={24} />
                                <span>{feedback}</span>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="w-full flex items-center justify-center gap-2 p-4 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg font-medium shadow-md">
                                <AlertCircle size={24} />
                                <span className="text-center">{feedback}</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!trailSelected || status === 'loading' || status === 'success'}
                        className="w-full py-4 rounded-xl font-bold text-lg text-white bg-[hsl(var(--button-1))] hover:bg-[hsl(var(--button-1-foreground))] shadow-lg transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {status === 'loading' && trailSelected ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Processando Inscrição...
                            </div>
                        ) : (
                            "Inscrever-se na Trilha"
                        )}
                    </button>
                </div>
            </form>
        </main>
      </div>
    </>
  );
}