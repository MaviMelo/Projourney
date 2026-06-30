
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Database, Shield, Smartphone, Globe, Cpu, Brain, Zap, Loader2, AlertCircle, CheckCircle, LogOut } from "lucide-react";
import SimpleButtom from "../components/common/simpleButton"
import SimpleLink from "../components/common/simpleLink";
import { BASE_URL } from "@/config/api";

// --- Interfaces e Mapeamento de Ícones ---

// Interface para os dados da trilha que virão da API PHP
interface Trail {
  id: number;   // O PHP retorna chaves em maiúsculas por padrão do PDO::FETCH_ASSOC
  name: string;
}

// Interface para os dados do usuário armazenados no localStorage
interface userLogged {
  id: number;
  name: string;
  // outros campos que o login.php retorna...
}

// Mapeamento para associar o nome da trilha a um ícone
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

  // --- Estados do Componente ---
  const [trails, setTrails] = useState<Trail[]>([]);
  const [trailSelected, setTrailSelected] = useState<number | null>(null);
  const [user, setUser] = useState<userLogged | null>(null);

  // Estados para controle da UI
  const [status, setStatus] = useState<'loading' | 'idle' | 'error' | 'success'>('loading');
  const [feedback, setFeedback] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    navigate('/login');
  }

  // --- carregar dados ---

  // 1. Pega os dados do usuário logado do localStorage
  useEffect(() => {
    const dataUser = localStorage.getItem('loggedUser');
    if (dataUser) {
      setUser(JSON.parse(dataUser));
    } else {
      // Se não houver usuário logado, redireciona para a página de login
      alert("Você precisa estar logado para acessar esta página.");
      navigate('/login');
    }
  }, [navigate]);

  // {console.log(JSON.stringify(user))};
  // debugger

  // 2. Busca a lista de trilhas na API 
  useEffect(() => {
    const fetchTrails = async () => {
      setStatus('loading');
      setFeedback('');
      try {

        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/trail`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Não foi possível carregar as trilhas.');
        }
        const data: Trail[] = await response.json();
        setTrails(data.trails);
        setStatus('idle');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Falha na comunicação com o servidor.';
        setFeedback(errorMessage);
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/trailUser`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          trail_id: trailSelected,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Erro ${response.status}`);
      }

      setFeedback(result.message);
      setStatus(result.status);

      if(result.status === "success"){

        setTimeout(() => {
          
          navigate('/perfil'); // Redireciona para o perfil do aluno
          
        }, 2000);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha ao realizar inscrição.';
      setFeedback(errorMessage);
      setStatus('error');
    }
  };

  return (
    <>

      <header className="header z-40">
        <h1 className="title">Escolha sua Trilha</h1>
        <nav className="itemsJustify">
          <div className="flex items-center space-x-4">
            {localStorage.getItem('loggedUser') ? (
              <SimpleLink to="/perfil" variant="navLink">
                <ArrowLeft className="w-5 h-5" />
                Início
              </SimpleLink>
            ) : (
              <SimpleLink to="/" variant="navLink">
                <ArrowLeft className="w-5 h-5" />
                Início
              </SimpleLink>
            )}

            <SimpleButtom onClick={handleLogout}
              variant="navButton"
              className="itemsJustify">
              <LogOut size={16} />
              Sair
            </SimpleButtom>
          </div>
        </nav>
      </header>

      <main className="centralize">
        <div className="card1">
          <h2 className="textCard itemsJustify2">
            <Zap className="w-8 h-8 text-yellow-400" />
            Trilhas de Conhecimento
          </h2>
          <p>
            Olá, {user?.name || 'aventureiro(a)'}! Selecione a trilha que mais se alinha com seus objetivos.
          </p>

          <form onSubmit={handleInscricao}>
            {status === 'loading' && !trails.length ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
              </div>
            ) : (
              <div className="containerGrid">
                {trails.map((trail) => {
                  const Icon = iconMap[trail.name] || Code;
                  const isSelected = trailSelected === trail.id;
                  return (
                    <div
                      key={trail.id}
                      onClick={() => setTrailSelected(trail.id)}
                      className={` itemsJustify2
                        ${isSelected
                          ? 'elementeCard2'
                          : 'elementeCard1'
                        }`}
                    >
                      <Icon className="w-7 h-7 text-cyan-400" />
                      <span className="text-lg font-medium">{trail.name}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 h-12"> {/* Altura fixa para evitar que o layout pule */}
              {status === 'success' && (
                <div className="warningSuccess">
                  <CheckCircle size={20} />
                  <span>{feedback}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="warningError">
                  <AlertCircle size={20} />
                  <span>{feedback}</span>
                </div>
              )}
            </div>
            <div
              className="centralize2 "
            >

              <SimpleButtom
                type="submit"
                variant="primary"
                disabled={!trailSelected || status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : "Inscrever-se na Trilha"}
              </SimpleButtom>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
