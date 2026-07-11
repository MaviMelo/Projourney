import { JSX, useState } from "react";
import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "@/config/api";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, User, Mail, Lock, Calendar, Phone, Eye, EyeOff } from "lucide-react";
import ParticleBackground from "@/components/effects/particleBackground";

interface AlunoFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    birth_date: string;
    phone: string;
}

export default function CadastrarAlunoPage(): JSX.Element {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AlunoFormData>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        birth_date: "",
        phone: "",
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // Estados independentes para visualizar senhas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

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
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                    birth_date: formData.birth_date || null,
                    phone: formData.phone || null,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Erro ${response.status}`);
            }

            setSuccess(result.message);
            setTimeout(() => {
                navigate('/login');
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

            <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
                
                {/* Botão de Voltar */}
                <div className="absolute top-8 left-8">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-[hsl(var(--button-2))] hover:text-[hsl(var(--button-2-foreground))] font-semibold transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Voltar ao início
                    </Link>
                </div>

                {/* Título Principal */}
                <div className="text-center mb-8 mt-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--button-2))] mb-3">
                        Junte-se a nós!
                    </h1>
                    <p className="text-black-600  text-lg">
                        Crie sua conta e comece sua jornada
                    </p>
                </div>

                {/* Card de Registro (Estilo Vidro/Sólido sincronizado com Login) */}
                <div className="w-full max-w-2xl bg-white dark:bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-2xl p-8 mb-8">
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        
                        {/* Grid de 2 Colunas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            
                            {/* Nome */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="name" className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-1 text-left">
                                    Nome Completo *
                                </label>
                                <div className="relative flex items-center">
                                    <User className="absolute left-3 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Seu nome completo"
                                        required
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--button-2))] focus:ring-1 focus:ring-[hsl(var(--button-2))] transition-all"
                                    />
                                </div>
                            </div>

                            {/* E-mail */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-1 text-left">
                                    E-mail *
                                </label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-3 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="seu@email.com"
                                        required
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--button-2))] focus:ring-1 focus:ring-[hsl(var(--button-2))] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Senha */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="password" className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-1 text-left">
                                    Senha *
                                </label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-3 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--button-2))] focus:ring-1 focus:ring-[hsl(var(--button-2))] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff w-5 h-5 /> : <Eye w-5 h-5 />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar Senha */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-1 text-left">
                                    Confirmar Senha *
                                </label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-3 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="Repita sua senha"
                                        required
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--button-2))] focus:ring-1 focus:ring-[hsl(var(--button-2))] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff w-5 h-5 /> : <Eye w-5 h-5 />}
                                    </button>
                                </div>
                            </div>

                            {/* Data de Nascimento */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="birth_date" className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-1 text-left">
                                    Data de Nascimento (Opcional)
                                </label>
                                <div className="relative flex items-center">
                                    <Calendar className="absolute left-3 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                    {/* Ajuste de padding especial para inputs de type date renderizarem melhor o ícone nativo */}
                                    <input
                                        id="birth_date"
                                        type="date"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--button-2))] focus:ring-1 focus:ring-[hsl(var(--button-2))] transition-all [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Telefone */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-1 text-left">
                                    Telefone (Opcional)
                                </label>
                                <div className="relative flex items-center">
                                    <Phone className="absolute left-3 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(11) 99999-9999"
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--button-2))] focus:ring-1 focus:ring-[hsl(var(--button-2))] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botão de Envio e Feedback */}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700/50 mt-2">
                            {success && (
                                <div className="flex items-center gap-2 p-3 mb-4 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg">
                                    <CheckCircle size={20} />
                                    <span className="text-sm font-medium">{success}</span>
                                </div>
                            )}
                            {error && (
                                <div className="flex items-center gap-2 p-3 mb-4 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !!success}
                                className="w-full py-3 mt-2 rounded-lg font-bold text-white bg-[hsl(var(--button-1))] hover:bg-[hsl(var(--button-1-foreground))] shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Finalizar Cadastro'}
                            </button>
                        </div>
                        
                        {/* Link extra para Login (Melhoria de UX) */}
                        <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Já possui uma conta?{" "}
                            <Link
                                to="/login"
                                className="text-[hsl(var(--button-3))] font-bold hover:underline ml-1"
                            >
                                Entre aqui!
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}