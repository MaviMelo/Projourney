import { JSX, useState } from "react";
import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {BASE_URL} from "@/config/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import ParticleBackground from "@/components/effects/particleBackground";

interface AlunoFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    birth_date: string;
    phone_number: string;
}

export default function CadastrarAlunoPage(): JSX.Element {
    const navigate = useNavigate(); // Hook para redirecionamento
    const [formData, setFormData] = useState<AlunoFormData>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        birth_date: "",
        phone_number: "",
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

        if (formData.password !== formData.password_confirmation) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            // Envia os dados para a API
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', 
                },
                body: JSON.stringify({ // Converte os dados do formulário para JSON
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                    birth_date: formData.birth_date || null,
                    phone_number: formData.phone_number || null,
                }),
            });

            const result = await response.json(); // Pega a resposta da API em JSON

            if (!response.ok) {
                // Se a resposta não for 2xx, lança um erro com a mensagem do PHP
                throw new Error(result.message || `Erro ${response.status}`);
            }

            setSuccess(result.message);
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
        <ParticleBackground/>

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
                                    <Label htmlFor="name">Nome Completo *</Label>
                                    <Input id="name" value={formData.name} onChange={handleChange} placeholder="Seu nome completo" required className="inputCard" />
                                </div>
                                <div>
                                    <Label htmlFor="email">E-mail *</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="Seu melhor e-mail" required className="inputCard" />
                                </div>
                                <div>
                                    <Label htmlFor="password">Senha *</Label>
                                    <Input id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Minimo 8 caracteres" required className="inputCard" />
                                </div>
                                <div>
                                    <Label htmlFor="password_confirmation">Confirmar Senha *</Label>
                                    <Input id="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} required className="inputCard" />
                                </div>
                                <div>
                                    <Label htmlFor="birth_date">Data de nascimento (opicional)</Label>
                                    <Input id="birth_date" type="date" value={formData.birth_date} onChange={handleChange} className="inputCard" />
                                </div>
                                <div>
                                    <Label htmlFor="phone_number">Telefone (opicional)</Label>
                                    <Input id="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} placeholder="(11) 99999-9999" className="inputCard" />
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
