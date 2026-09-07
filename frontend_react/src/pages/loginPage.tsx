import { useState } from "react"
import type React from "react"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Github, Chrome, Unlock, AlertCircle} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import SimpleLink from "../components/common/simpleLink"
import { login, initCsrf } from '@/lib/api';
import ParticleBackground from "@/components/effects/particleBackground"

interface LoginFormData {
    email: string
    password: string
    rememberMe: boolean
}

export default function LoginPage(): React.ReactElement {

    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
        rememberMe: false,
    })

    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            // Garante que o cookie XSRF-TOKEN está presente antes do POST
            await initCsrf();

            const response = await login(formData.email, formData.password);

            if (response.status !== 'success') {
                throw new Error(response.message || 'Ocorreu um erro na verificação dos dados.')
            }

            navigate('/perfil')

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'falha na comunicação.';
            setError(errorMessage);

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <ParticleBackground />

            <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
                
                <div className="absolute top-8 left-8">
                    <SimpleLink to="/" variant="navLink">
                        <div className="flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-lg font-semibold">Voltar ao início</span>
                        </div>
                    </SimpleLink>
                </div>

                {/* Título Principal */}
                <div className="text-center mb-8 mt-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--button-2))] mb-3">
                        Bem-vindo de volta!
                    </h1>
                    <p className="text-black-600 text-lg">
                        Entre na sua conta para continuar aprendendo
                    </p>
                </div>

                <div className="w-full max-w-md bg-white dark:bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-2xl p-8">
                    
                    <div className="flex flex-col items-center mb-8 text-center">
                        <Unlock className="text-white w-8 h-8 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Entrar na Conta
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Digite suas credenciais para acessar sua conta
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        {/* Campo de E-mail */}
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder="seu@email.com"
                                    required
                                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--button-2))] focus:ring-1 focus:ring-[hsl(var(--button-2))] transition-all"
                                />
                            </div>
                        </div>

                        {/* Campo de Senha */}
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    placeholder="Sua senha"
                                    required
                                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--button-2))] focus:ring-1 focus:ring-[hsl(var(--button-2))] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={(): void => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                        setFormData({ ...formData, rememberMe: e.target.checked })
                                    }
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent text-[hsl(var(--button-2))] focus:ring-[hsl(var(--button-2))]"
                                />
                                Lembrar de mim
                            </label>
                            
                            <SimpleLink to="#" variant="navLink">
                                Esqueceu a senha?
                            </SimpleLink>
                        </div>

                        {/* Mensagem de Erro formatada */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 mt-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 py-3 rounded-lg font-bold text-white bg-[hsl(var(--button-1))] hover:bg-[hsl(var(--button-1-foreground))] shadow-lg transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Entrando...</span>
                                </div>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700/50 pt-6">
                        <span>Não tem uma conta?</span>
                        <SimpleLink to="/cadastrar" variant="navLink">
                            Cadastre-se aqui!
                        </SimpleLink>
                    </div>
                </div>
            </div>
        </>
    )
}