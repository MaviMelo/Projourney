import { useState } from "react";
import type React from "react";
import ParticleBackground from "@/components/effects/particlebackground";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {BASE_URL} from "@/config/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface AlunoFormData {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    data_nascimento: string;
    telefone: string;
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

        setLoading(true);

        try {
            // Envia os dados para a API PHP
            // URL para ser usada com a API rodando no comando 'php -S localhost:8000'
            const response = await fetch(`${BASE_URL}/cadastrar_aluno`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ // Converte os dados do formulário para JSON
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    data_nascimento: formData.data_nascimento,
                    telefone: formData.telefone,
                }),
            });

            const result = await response.json(); // Pega a resposta da API em JSON

            if (!response.ok) {
                // Se a resposta não for 2xx, lança um erro com a mensagem do PHP
                throw new Error(result.mensagem || `Erro ${response.status}`);
            }

            setSuccess(result.mensagem);
            setTimeout(() => {
                navigate('/login'); // Redireciona para o login após o sucesso
            }, 500);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Falha na comunicação com o servidor.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (

        <>
            <ParticleBackground />
            <div className="centralize">

                <Link to="/" className="buttonLink">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Voltar para o Início</span>
                </Link>

                <Card className="card1">

                    <CardHeader>
                        <CardTitle className="title">Crie sua Conta</CardTitle>
                        <CardDescription className="textCard3">
                            Preencha os campos abaixo para criar sua conta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            {/* Campos do formulário */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nome">Nome Completo *</Label>
                                    <Input id="nome" value={formData.nome} onChange={handleChange} required className="inputCard" />
                                </div>
                                <div>
                                    <Label htmlFor="email">E-mail *</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="inputCard" />
                                </div>
                                <div>
                                    <Label htmlFor="senha">Senha *</Label>
                                    <Input id="senha" type="password" value={formData.senha} onChange={handleChange} required className="inputCard" />
                                </div>
                                <div>
                                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                                    <Input id="confirmarSenha" type="password" value={formData.confirmarSenha} onChange={handleChange} required className="inputCard" />
                                </div>
                                <div>
                                    <Label htmlFor="data_nascimento">Data de nascimento (opicional)</Label>
                                    <Input id="data_nascimento" type="date" value={formData.data_nascimento} onChange={handleChange} className="inputCard" />
                                </div>
                                <div>
                                    <Label htmlFor="telefone">Telefone (opicional)</Label>
                                    <Input id="telefone" type="tel" value={formData.telefone} onChange={handleChange} placeholder="(11) 99999-9999" className="inputCard" />
                                </div>
                            </div>

                            {/* Botão de Envio e Feedback */}
                            <div className="pt-4">
                                {/* Mensagem de Sucesso */}
                                {success && (
                                    <div className="warningSuccess">
                                        <CheckCircle size={20} />
                                        <span>{success}</span>
                                    </div>
                                )}
                                {/* Mensagem de Erro */}
                                {error && (
                                    <div className="warningError">
                                        <AlertCircle size={20} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <Button type="submit" disabled={loading || !!success} className="buttonPrimary">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Finalizar Cadastro'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
