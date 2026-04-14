import { useState } from "react"
import type React from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import ParticleBackground from "@/components/effects/particlebackground"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Github, Chrome } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"  // Mudança do 'next/link' para o 'react-router-dom"
import type { JSX } from "react/jsx-runtime"

interface LoginFormData {
    email: string
    password: string
    rememberMe: boolean
}

export default function LoginPage(): JSX.Element {

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
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                   email: formData.email,
                   password: formData.password,
                }),
            })
            
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.mensagem || 'Ocorreu um erro desconhecido.')
            }

            alert(result.mensagem)
            
            // Guarda os dados do usuário no navegador para 'lembrar' que está logado.
            localStorage.setItem('usuarioLogado', JSON.stringify(result.dados_usuario))


             navigate('/perfil')

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'falha na comunicação.';
            setError(errorMessage);
            console.log(response);

        } finally {
            setIsLoading(false); // Desativa o estado de 'carregando'.
        }
    }

    const handleSocialLogin = (provider: string): void => {
        console.log(`Login com ${provider}`)
        alert(`Redirecionando para login com ${provider}...`)
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <ParticleBackground />
                <div className="mb-8">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 mb-6 text-[#00aaff] hover:text-blue-300 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-lg font-semibold">Voltar ao início</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
                        <p className="text-gray-400">Entre na sua conta para continuar aprendendo</p>
                    </div>
                </div>

                {/* Login  */}
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-white flex items-center gap-2">
                            <Lock className="w-6 h-6 text-blue-400" />
                            Entrar na Conta
                        </CardTitle>
                        <CardDescription className="text-gray-300">Digite suas credenciais para acessar sua conta</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* quando o email da erro*/}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">
                                    E-mail *
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="bg-gray-800 border-gray-600 text-white pl-10 focus:border-blue-400"
                                        placeholder="seu@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* senha errada */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">
                                    Senha *
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        className="bg-gray-800 border-gray-600 text-white pl-10 pr-10 focus:border-blue-400"
                                        placeholder="Sua senha"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={(): void => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                            setFormData({ ...formData, rememberMe: e.target.checked })
                                        }
                                        className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                                    />
                                    <Label htmlFor="remember" className="text-sm text-gray-300">
                                        Lembrar de mim
                                    </Label>
                                </div>
                                <Link to="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                    Esqueceu a senha?
                                </Link>
                            </div>

                            {error && (
                                <div className="text-cente text-red-400 bg-red-900/50 p-2 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Login Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 transition-all duration-300"
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Entrando...</span>
                                    </div>
                                ) : (
                                    "Entrar"
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-gray-900 px-2 text-gray-400">Ou continue com</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(): void => handleSocialLogin("Google")}
                                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors"
                            >
                                <Chrome className="w-4 h-4 mr-2" />
                                Google
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(): void => handleSocialLogin("GitHub")}
                                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors"
                            >
                                <Github className="w-4 h-4 mr-2" />
                                GitHub
                            </Button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-gray-400">
                                Não tem uma conta?{" "}
                                <Link to="/cadastrar" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                                    Cadastre-se aqui
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Features */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm mb-4">Ao entrar, você terá acesso a:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-gray-400">
                            <span className="text-blue-400">✓</span> Cursos personalizados
                        </div>
                        <div className="text-gray-400">
                            <span className="text-green-400">✓</span> Progresso salvo
                        </div>
                        <div className="text-gray-400">
                            <span className="text-yellow-400">✓</span> Certificados
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
