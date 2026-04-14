
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Database, Shield, Smartphone, Globe, Cpu, Brain, Zap, Loader2, AlertCircle, CheckCircle, LogOut } from "lucide-react";

import SimpleLink from "../components/common/simpleLink";
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

  // --- Efeitos para carregar dados ---

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
        const response = await fetch('http://localhost:8000/listar_trilhas.php');
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
      const response = await fetch('http://localhost:8000/inscrever_trilha.php', {
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
    <div className="min-h-screen  text-white font-sans flex flex-col">
      <ParticleBackground />

      <header className="bg-blue-900/40 backdrop-blur-md border-b border-blue-500/30 px-[90px] py-4 sticky top-0 z-10">

        <div className="flex items-center justify-between mx-auto">
          <h1 className="text-2xl font-bold text-white">Escolha sua Trilha</h1>
          <nav className="flex items-center justify-between space-x-6">
            <div className="flex items-center space-x-4">
              {localStorage.getItem('usuarioLogado') ? (
                <SimpleLink to="/perfil" variant="nav">
                  <ArrowLeft className="w-5 h-5" />
                  Início
                </SimpleLink>
              ) : (
                <SimpleLink to="/" variant="nav">
                  Início
                </SimpleLink>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-gray-900/50 border border-gray-700 rounded-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold flex items-center gap-3 mb-2 text-white">
            <Zap className="w-8 h-8 text-yellow-400" />
            Trilhas de Conhecimento
          </h2>
          <p className="text-gray-400">
            Olá, {usuario?.nome || 'aventureiro(a)'}! Selecione a trilha que mais se alinha com seus objetivos.
          </p>

          <form onSubmit={handleInscricao}>
            {status === 'loading' && !trilhas.length ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {trilhas.map((trilha) => {
                  const Icon = iconMap[trilha.nome] || Code;
                  const isSelected = trilhaSelecionada === trilha.id;
                  return (
                    <div
                      key={trilha.id}
                      onClick={() => setTrilhaSelecionada(trilha.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center gap-4
                        ${isSelected
                          ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300 ring-2 ring-cyan-400'
                          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
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
                <div className="flex items-center justify-center gap-2 text-green-400 p-3 bg-green-900/50 rounded-md">
                  <CheckCircle size={20} />
                  <span>{feedback}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center justify-center gap-2 text-red-400 p-3 bg-red-900/50 rounded-md">
                  <AlertCircle size={20} />
                  <span>{feedback}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={!trilhaSelecionada || status === 'loading' || status === 'success'}
                className="px-8 py-3 rounded-lg font-bold text-lg text-white transition-transform bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : "Inscrever-se na Trilha"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
