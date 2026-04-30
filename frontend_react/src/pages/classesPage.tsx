
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ExternalLink, ArrowLeft, LogOut } from 'lucide-react';
import SimpleLink from "../components/common/simpleLink";
import SimpleButtom from "../components/common/simpleButton"
import {BASE_URL} from "@/config/api";
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
                const response = await fetch(`${BASE_URL}/cursos_da_trilha.php?trilhaId=${trilhaId}`);
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
        <>
            <ParticleBackground />

            <header className="header z-40">

                <h1 className="title">Cursos da Trilha</h1>
                <div className="itemsJustify">
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

            </header>

            <main className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="itemsJustify">
                    <SimpleLink to="/perfil" variant="navButton">
                        <ArrowLeft />
                        Voltar para Minhas Trilhas
                    </SimpleLink>
                </div>

                <div className="">
                    {cursos.length > 0 ? (
                        cursos.map(curso => (
                            <div     className="card1 itemsJustify">
                                <a
                                    key={curso.id}
                                    className="itemsJustify textLink"
                                    href={curso.link_curso}
                                    target="_blank" // Abre o link em uma nova aba
                                    rel="noopener noreferrer" // Boa prática de segurança para links externos
                                
                                >
                                        <h3 className="textCard">{curso.nome}</h3>
                                    <ExternalLink  size={20} />
                                </a>
                                    <div>
                                        <span className="text-sm text-gray-400 mt-1 inline-block">{curso.nivel}</span>
                                    </div>
                            </div>
                        ))
                    ) : (
                        <p className="card1">Nenhum curso encontrado para esta trilha.</p>
                    )}
                </div>
            </main>
        </>
    );
}
