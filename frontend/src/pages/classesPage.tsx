
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ExternalLink, LogOut } from 'lucide-react';
import SimpleLink from "../components/common/simpleLink";
import ParticleBackground from '../components/effects/particlebackground';  

// Interface para tipar os dados do curso que vêm da API
interface Curso {
    id: number;
    nome: string;
    nivel: string;
    link_curso: string;
}

export default function AulasPage(): React.JSX.Element {

    const navigate = useNavigate();
    const { trilhaId } = useParams<{ trilhaId: string }>();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

    const handleLogout = () => {
        localStorage.removeItem('usuarioLogado');
        navigate('/login');
    }

    useEffect(() => {
        if (!trilhaId) return;

        const fetchCursos = async () => {
            try {
                // Chama o endpoint do backend
                const response = await fetch(`http://localhost:8000/cursos_da_trilha.php?trilhaId=${trilhaId}`);
                if (!response.ok) {
                    // Se a resposta não for OK, tenta ler o corpo como texto para ver o erro do PHP
                    const errorText = await response.text();
                    throw new Error(`Erro do Servidor: ${errorText}`);
                }

                const data: Curso[] = await response.json();
                setCursos(data);
                setStatus('success');

            } catch (error) {

                console.error("Erro ao buscar cursos:", error);
                setStatus('error');
            }
        };

        fetchCursos();
    }, [trilhaId]); // Roda a busca sempre que o ID da trilha mudar

    // --- Renderização Condicional Simples ---
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h1 className="text-xl font-bold">Erro ao carregar os cursos.</h1>
                <Link to="/perfil" className="mt-6 bg-blue-600 px-6 py-2 rounded-lg">Voltar ao Perfil</Link>
            </div>
        );
    }

    // --- Renderização da Lista de Cursos ---
    return (
        <div className=" text-white">
            <ParticleBackground />

            {/* Header */}
            <header className="sticky top-0 bg-blue-900/40 backdrop-blur-md border-b border-blue-500/30 px-[90px] py-4">
                <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">Cursos da Trilha</h1>
                    <nav className="flex items-center justify-between space-x-6">
                        <div className="flex items-center space-x-4">
                            {localStorage.getItem('usuarioLogado') ? (
                                <SimpleLink to="/perfil" variant="nav">
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

            <main className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="mb-10">
                    <Link to="/perfil" className="text-blue-400 hover:underline mb-4 inline-block">
                        ← Voltar para Minhas Trilhas
                    </Link>
                </div>

                <div className="space-y-4">
                    {cursos.length > 0 ? (
                        cursos.map(curso => (
                            <a
                                key={curso.id}
                                href={curso.link_curso} // link direto do banco
                                target="_blank" // Abre o link em uma nova aba
                                rel="noopener noreferrer" // Boa prática de segurança para links externos
                                className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 flex items-center justify-between transition-all hover:border-blue-500 hover:bg-gray-800"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{curso.nome}</h3>
                                    <span className="text-sm text-gray-400 mt-1 inline-block">{curso.nivel}</span>
                                </div>
                                <ExternalLink className="text-gray-500" size={20} />
                            </a>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-10">Nenhum curso encontrado para esta trilha.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
