import { useState } from "react";
import type React from "react";
import ParticleBackground from "@/components/effects/particlebackground";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";

// Interface simplificada para os dados do formulário, correspondendo à tabela PJ_ALUNO
interface AlunoFormData {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    data_nascimento: string; // Usamos string no formulário para facilitar a digitação
    telefone: string;
    cidade: string;
    objetivos: string; // Mapeado para a coluna 'descricao' no banco
    areasInteresse: string[]; // Exemplo: ['frontend', 'backend']
}

export default function CadastrarAlunoPage(): JSX.Element {
    const navigate = useNavigate(); // Hook para redirecionamento
    const [formData, setFormData] = useState<AlunoFormData>({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        data_nascimento: "",
        telefone: "",
        cidade: "",
        objetivos: "",
        areasInteresse: [], // Começa vazio
    });

    // Estados para controlar o feedback da interface
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Função para lidar com a mudança nos inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Função para enviar o formulário para a API PHP
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.senha !== formData.confirmarSenha) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true); // Mostra um indicador de carregamento

        try {
            // Envia os dados para a API PHP
            // URL para ser usada com a API rodando no comando 'php -S localhost:8000'
                const response = await fetch('http://localhost:8000/api/cadastrar_aluno', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    data_nascimento: formData.data_nascimento,
                    telefone: formData.telefone,
                    cidade: formData.cidade,
                    objetivos: formData.objetivos,
                    areasInteresse: formData.areasInteresse,
                }),
            });

            console.log(response);
            const result = await response.json(); // Pega a resposta da API em JSON
            console.log(result);

            if (!response.ok) {

                console.log(result); // 👈 veja o erro real
                // Se a resposta não for 2xx, lança um erro com a mensagem do PHP
                throw new Error(result.mensagem || `Erro ${response.status}`);
            }

            setSuccess(result.mensagem);
            setTimeout(() => {
                navigate('/login'); // Redireciona para o login após o sucesso
            }, 2000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Falha na comunicação com o servidor.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white p-4 sm:p-8">
            <ParticleBackground />
            <div className="max-w-2xl mx-auto">

                <header className="mb-8">
                    <Link to="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Voltar para o Início</span>
                    </Link>
                </header>

                <Card className=" bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                    
                    <CardHeader>
                        <CardTitle className="text-3xl text-white">Crie sua Conta</CardTitle>
                        <CardDescription className="text-gray-400">
                            Preencha os campos abaixo para iniciar sua jornada.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-white">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Campos do formulário */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nome">Nome Completo *</Label>
                                    <Input id="nome" value={formData.nome} onChange={handleChange} required className="bg-gray-700 border-gray-600" />
                                </div>
                                <div>
                                    <Label htmlFor="email">E-mail *</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="bg-gray-700 border-gray-600" />
                                </div>
                                <div>
                                    <Label htmlFor="senha">Senha *</Label>
                                    <Input id="senha" type="password" value={formData.senha} onChange={handleChange} required className="bg-gray-700 border-gray-600" />
                                </div>
                                <div>
                                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                                    <Input id="confirmarSenha" type="password" value={formData.confirmarSenha} onChange={handleChange} required className="bg-gray-700 border-gray-600" />
                                </div>
                                <div>
                                    <Label htmlFor="data_nascimento">Data de nascimento *</Label>
                                    <Input id="data_nascimento" type="date" value={formData.data_nascimento} onChange={handleChange} required className="bg-gray-700 border-gray-600" />
                                </div>
                                <div>
                                    <Label htmlFor="telefone">Telefone *</Label>
                                    <Input id="telefone" type="tel" value={formData.telefone} onChange={handleChange} required placeholder="(11) 99999-9999" className="bg-gray-700 border-gray-600" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="cidade">Cidade (Opcional)</Label>
                                <Input id="cidade" value={formData.cidade} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                            </div>
                            <div>
                                <Label htmlFor="objetivos">Descreva seus objetivos (Opcional)</Label>
                                <Textarea id="objetivos" value={formData.objetivos} onChange={handleChange} placeholder="Ex: Conseguir meu primeiro emprego como dev front-end." className="bg-gray-700 border-gray-600" />
                            </div>

                            {/* Botão de Envio e Feedback */}
                            <div className="pt-4">
                                {/* Mensagem de Sucesso */}
                                {success && (
                                    <div className="flex items-center gap-2 text-green-400 p-3 bg-green-900/50 rounded-md mb-4">
                                        <CheckCircle size={20} />
                                        <span>{success}</span>
                                    </div>
                                )}
                                {/* Mensagem de Erro */}
                                {error && (
                                    <div className="flex items-center gap-2 text-red-400 p-3 bg-red-900/50 rounded-md mb-4">
                                        <AlertCircle size={20} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <Button type="submit" disabled={loading || !!success} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Finalizar Cadastro'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
