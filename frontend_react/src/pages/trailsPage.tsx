import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Database, Shield, Smartphone, Globe, Cpu, Brain, Zap, Loader2, AlertCircle, CheckCircle, ChevronRight, BookOpen, Clock } from "lucide-react";
import ParticleBackground from "@/components/effects/particleBackground";
import { apiFetch, initAuth } from '@/lib/api';

// --- Interfaces e Mapeamento de Ícones ---
interface Course {
  id: number;
  name: string;
  level?: string;
}

interface Trail {
  id: number;
  name: string;
  courses?: Course[];
}

interface UserLogged {
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

// --- Componente: Card individual da trilha (com estado próprio de expansão) ---
const TrailCard: React.FC<{ trail: Trail; onSelect: (id: number) => void; isSelected: boolean }> = ({ trail, onSelect, isSelected }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[trail.name] || Code;
  const courses = trail.courses || [];

  return (
    <div key={trail.id} className="relative flex flex-col items-center text-center gap-4 p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 backdrop-blur-md">
      {/* Ícone e nome da trilha (clicável para selecionar) */}
      <div onClick={() => onSelect(trail.id)} className="flex flex-col items-center gap-3 mb-4 select-none">
        <div className={`p-4 rounded-full ${isSelected ? 'bg-[hsl(var(--button-2))] text-white' : 'bg-gray-100 dark:bg-gray-800 text-[hsl(var(--button-2))] dark:text-blue-400'}`}>
          <Icon className="w-8 h-8" />
        </div>
        <span className={`text-xl font-bold ${isSelected ? '!text-[hsl(var(--button-2))] dark:!text-blue-300' : '!text-gray-800 dark:!text-gray-200'}`}>
          {trail.name}
        </span>
      </div>

      {/* Dropdown de cursos (expande ao clicar no ícone lateral) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        aria-label={expanded ? "Ocultar cursos da trilha" : "Mostrar cursos da trilha"}
        className={`absolute right-3 top-3 p-1.5 rounded-lg transition-all ${expanded ? 'bg-[hsl(var(--button-2))] text-white' : 'bg-gray-100 dark:bg-gray-800 text-[hsl(var(--button-2))] dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        <ChevronRight size={16} className={expanded ? 'rotate-90' : ''} />
      </button>

      {expanded && courses.length > 0 && (
        <div className="flex flex-col items-center gap-2 w-full px-4 pt-2 pb-4 max-w-xs">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 border-b border-gray-100 dark:border-gray-700 w-full pb-1">
            Cursos ({courses.length})
          </span>
          <div className="flex flex-col gap-1 w-full">
            {courses.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-2 px-2 py-1 rounded-lg text-left bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/40">
                <BookOpen className="w-3 h-3 text-blue-500 dark:text-blue-400 shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                  {c.name}
                </span>
                {c.level && (
                  <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-[hsl(var(--button-2))] dark:text-blue-400 border border-blue-200 dark:border-blue-500 uppercase">
                    {c.level}
                  </span>
                )}
              </div>
            ))}
            {courses.length > 5 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 italic ml-2">
                +{courses.length - 5} outros
              </span>
            )}
          </div>
        </div>
      )}
      {expanded && courses.length === 0 && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 italic">
          <Clock size={14} />
          Sem cursos cadastrados
        </div>
      )}

      {/* Sombra/borda condicional */}
      <div className={`absolute inset-0 rounded-2xl border-2 pointer-events-none transition-all ${isSelected
        ? 'border-[hsl(var(--button-2))] dark:border-blue-400 shadow-xl'
        : 'border-gray-200 dark:border-gray-700/60 shadow-md hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500'
      }`} />
    </div>
  );
};

export default function TrailsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [trails, setTrails] = useState<Trail[]>([]);
  const [trailSelected, setTrailSelected] = useState<number | null>(null);
  const [user, setUser] = useState<UserLogged | null>(null);
  const [status, setStatus] = useState<'loading' | 'idle' | 'error' | 'success'>('loading');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
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
        const response = await apiFetch('/index-pega');
        
        if (response.status !== 'success') {
          throw new Error(response.message || 'Não foi possível carregar as trilhas.');
        }
        
        // Tratamento seguro para extrair o array de trilhas considerando o formato do apiFetch e do Laravel
        const responseData = response.data as { trails?: Trail[] | { data: Trail[] }, data?: { trails?: Trail[] } };
        const rawTrails = responseData?.trails || responseData?.data?.trails || [];
        const trailsArray = Array.isArray(rawTrails) ? rawTrails : (rawTrails as { data: Trail[] }).data || [];

        setTrails(trailsArray);
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
      const response = await apiFetch('/trail-users', {
        method: 'POST',
        body: JSON.stringify({
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
                    Olá, <strong className="text-[hsl(var(--button-2))]">{user?.name.split(' ')[0] || 'aventureiro(a)'}</strong>! Selecione a trilha do sistema que mais se alinha com seus objetivos profissionais.
                </p>
            </div>

            <form onSubmit={handleInscricao} className="w-full flex flex-col items-center">
                
                {/* Grid de Trilhas */}
                {status === 'loading' && !trails.length ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-16 h-16 animate-spin text-[hsl(var(--button-2))]" />
                    </div>
                ) : trails.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                        {trails.map((trail) => (
                            <TrailCard
                                key={trail.id}
                                trail={trail}
                                onSelect={(id) => setTrailSelected(id)}
                                isSelected={trailSelected === trail.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-12 border border-dashed rounded-2xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-2">Nenhuma trilha do sistema encontrada.</h3>
                        <p className="text-gray-500 text-sm">Volte mais tarde para conferir novos conteúdos oficiais.</p>
                    </div>
                )}

                {/* Área de Alertas e Botão de Submit */}
                <div className="mt-12 w-full max-w-md flex flex-col items-center gap-6">
                    
                    {/* Alertas */}
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
