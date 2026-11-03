import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Database, Shield, Smartphone, Globe, Cpu, Brain, Zap, AlertCircle, CheckCircle, ChevronRight, BookOpen, Clock } from "lucide-react";
import ParticleBackground from "@/components/effects/particleBackground";
import { apiFetch } from '@/lib/api';

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
    <div className="trailCard">
      {/* Ícone e nome da trilha (clicável para selecionar) */}
      <div onClick={() => onSelect(trail.id)} className="trailCardMain">
        <div className={`trailCardIconWrap ${isSelected ? 'isSelected' : ''}`}>
          <Icon size={32} />
        </div>
        <span className={`trailCardName ${isSelected ? 'isSelected' : ''}`}>
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
        className={`trailCardToggle ${expanded ? 'isOpen' : ''}`}
      >
        <ChevronRight size={16} />
      </button>

      {expanded && courses.length > 0 && (
        <div className="trailCardDropdown">
          <span className="trailCardDropdownTitle">
            Cursos ({courses.length})
          </span>
          <div className="trailCardCourseList">
            {courses.slice(0, 5).map((c) => (
              <div key={c.id} className="trailCardCourse">
                <BookOpen size={12} className="trailCardCourseIcon" />
                <span className="trailCardCourseName">
                  {c.name}
                </span>
                {c.level && (
                  <span className="trailCardCourseLevel">
                    {c.level}
                  </span>
                )}
              </div>
            ))}
            {courses.length > 5 && (
              <span className="trailCardMore">
                +{courses.length - 5} outros
              </span>
            )}
          </div>
        </div>
      )}
      {expanded && courses.length === 0 && (
        <div className="trailCardEmpty">
          <Clock size={14} />
          Sem cursos cadastrados
        </div>
      )}

      {/* Sombra/borda condicional */}
      <div className={`trailCardOutline ${isSelected ? 'isSelected' : 'isIdle'}`} />
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

      <div className="trailsPage">

        {/* Botão Voltar */}
        <div className="pageTopBar">
            <Link to="/perfil" className="navBackLink">
                <ArrowLeft size={20} />
                Voltar para o Perfil
            </Link>
        </div>

        <main className="trailsMain">

            {/* Cabeçalho Principal */}
            <div className="trailsHero">
                <div className="trailsHeroTitleRow">
                    <Zap size={40} className="trailsHeroIcon" />
                    <h1 className="trailsHeroTitle">
                        Trilhas de Conhecimento
                    </h1>
                </div>
                <p className="trailsHeroText">
                    Olá, <strong className="trailsHeroName">{user?.name.split(' ')[0] || 'aventureiro(a)'}</strong>! Selecione a trilha do sistema que mais se alinha com seus objetivos profissionais.
                </p>
            </div>

            <form onSubmit={handleInscricao} className="trailsForm">

                {/* Grid de Trilhas */}
                {status === 'loading' && !trails.length ? (
                    <div className="trailsLoader">
                        <div className="stateSpinner" />
                    </div>
                ) : trails.length > 0 ? (
                    <div className="trailsGrid">
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
                    <div className="emptyState emptyStateNarrow">
                        <h3 className="emptyStateTitle">Nenhuma trilha do sistema encontrada.</h3>
                        <p className="emptyStateText">Volte mais tarde para conferir novos conteúdos oficiais.</p>
                    </div>
                )}

                {/* Área de Alertas e Botão de Submit */}
                <div className="trailsActions">

                    {/* Alertas */}
                    <div className="alertSlot">
                        {status === 'success' && (
                            <div className="trailsAlertBase alertSuccess">
                                <CheckCircle size={24} />
                                <span>{feedback}</span>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="trailsAlertBase alertError">
                                <AlertCircle size={24} />
                                <span>{feedback}</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!trailSelected || status === 'loading' || status === 'success'}
                        className="trailsSubmit"
                    >
                        {status === 'loading' && trailSelected ? (
                            <div className="formSubmitLoader">
                                <div className="formSpinner" />
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
