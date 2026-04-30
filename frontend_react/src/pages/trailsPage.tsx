
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Database, Shield, Smartphone, Globe, Cpu, Brain, Zap, Loader2, AlertCircle, CheckCircle, LogOut } from "lucide-react";
import SimpleButtom from "../components/common/simpleButton"
import SimpleLink from "../components/common/simpleLink";
import {BASE_URL} from "@/config/api";
import ParticleBackground from "../components/effects/particlebackground";

// --- Interfaces e Mapeamento de Ícones ---

// Interface para os dados da trilha que virão da API PHP
interface Trilha {
  id: number;   // O PHP retorna chaves em maiúsculas por padrão do PDO::FETCH_ASSOC
  nome: string;
}

// Interface para os dados do usuário armazenados no localStorage
interface UsuarioLogado {
  id: number;
  nome: string;
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
};

export default function TrilhasPage(): React.JSX.Element {
  const navigate = useNavigate();

  // --- Estados do Componente ---
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [trilhaSelecionada, setTrilhaSelecionada] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  // Estados para controle da UI
  const [status, setStatus] = useState<'loading' | 'idle' | 'error' | 'success'>('loading');
  const [feedback, setFeedback] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  }

  // --- carregar dados ---

  // 1. Pega os dados do usuário logado do localStorage
  useEffect(() => {
    const dadosUsuarioString = localStorage.getItem('usuarioLogado');
    if (dadosUsuarioString) {
      setUsuario(JSON.parse(dadosUsuarioString));
    } else {
      // Se não houver usuário logado, redireciona para a página de login
      alert("Você precisa estar logado para acessar esta página.");
      navigate('/login');
    }
  }, [navigate]);

  // 2. Busca a lista de trilhas da API PHP
  useEffect(() => {
    const fetchTrilhas = async () => {
      setStatus('loading');
      setFeedback('');
      try {
        const response = await fetch(`${BASE_URL}/listar_trilhas.php`);
        if (!response.ok) {
          throw new Error('Não foi possível carregar as trilhas.');
        }
        const data: Trilha[] = await response.json();
        setTrilhas(data);
        setStatus('idle');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Falha na comunicação com o servidor.';
        setFeedback(errorMessage);
        setStatus('error');
      }
    };

    fetchTrilhas();
  }, []);

  // --- Função de Inscrição ---
  const handleInscricao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trilhaSelecionada) {
      setFeedback("Por favor, selecione uma trilha para continuar.");
      setStatus('error');
      return;
    }

    if (!usuario) {
      setFeedback("Erro: Usuário não identificado. Por favor, faça login novamente.");
      setStatus('error');
      return;
    }

    setStatus('loading');
    setFeedback('');

    try {
      const response = await fetch(`${BASE_URL}/inscrever_trilha.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alunoId: usuario.id,
          trilhaId: trilhaSelecionada,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensagem || `Erro ${response.status}`);
      }

      setFeedback(result.mensagem);
      setStatus('success');

      setTimeout(() => {

        navigate('/perfil'); // Redireciona para o perfil do aluno

      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha ao realizar inscrição.';
      setFeedback(errorMessage);
      setStatus('error');
    }
  };

  return (
    <>
      <ParticleBackground />

      <header className="header z-40">
        <h1 className="title">Escolha sua Trilha</h1>
        <nav className="itemsJustify">
          <div className="flex items-center space-x-4">
            {localStorage.getItem('usuarioLogado') ? (
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
            Olá, {usuario?.nome || 'aventureiro(a)'}! Selecione a trilha que mais se alinha com seus objetivos.
          </p>

          <form onSubmit={handleInscricao}>
            {status === 'loading' && !trilhas.length ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
              </div>
            ) : (
              <div className="containerGrid">
                {trilhas.map((trilha) => {
                  const Icon = iconMap[trilha.nome] || Code;
                  const isSelected = trilhaSelecionada === trilha.id;
                  return (
                    <div
                      key={trilha.id}
                      onClick={() => setTrilhaSelecionada(trilha.id)}
                      className={` itemsJustify2
                        ${isSelected
                          ? 'elementeCard2'
                          : 'elementeCard1'
                        }`}
                    >
                      <Icon className="w-7 h-7 text-cyan-400" />
                      <span className="text-lg font-medium">{trilha.nome}</span>
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
                disabled={!trilhaSelecionada || status === 'loading' || status === 'success'}
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
