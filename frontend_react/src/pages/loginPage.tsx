import { useState } from "react"
import type React from "react"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Github, Chrome } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"  // Mudança do 'next/link' para o 'react-router-dom"
import SimpleLink from "../components/common/simpleLink"
import { BASE_URL } from "@/config/api";
import type { JSX } from "react/jsx-runtime"
import ParticleBackground from "@/components/effects/particleBackground"

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
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/jso'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Ocorreu um erro na verificação dos dados.')
            }

            // Guardar dados e token do usuário no navegador para 'lembrar' que está logado e autenticar requisições futuras.
            localStorage.setItem('loggedUser', JSON.stringify(result.user));
            localStorage.setItem('token', result.token);


            navigate('/perfil')

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'falha na comunicação.';
            setError(errorMessage);

        } finally {
            setIsLoading(false); // Desativa o estado de 'carregando'.
        }
    }

    return (
        <>
            <ParticleBackground />

            <div className="centralize">
                <div>
                    <div className=" itemsJustify">
                        <SimpleLink
                            to="/"
                            variant="navLink"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-lg font-semibold">Voltar ao início</span>
                        </SimpleLink>
                    </div>
                    <div>
                        <h1 className="title">Bem-vindo de volta!</h1>
                        <p className=" itemsJustify">Entre na sua conta para continuar aprendendo</p>
                    </div>

                    {/* Login  */}
                    <Card className="card1">
                        <CardHeader>
                            <CardTitle className="title">
                                <Lock />
                                Entrar na Conta
                            </CardTitle>
                            <CardDescription>Digite suas credenciais para acessar sua conta</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                {/* quando o email da erro*/}
                                <div>
                                    <Label htmlFor="email" className="textCard2">
                                        E-mail *
                                    </Label>
                                    <div className="itemsJustify">
                                        <Mail />
                                        <Input
                                            className="     inputCard"
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            placeholder="seu@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* senha */}
                                <div>
                                    <Label htmlFor="password" className="textCard2">
                                        Senha *
                                    </Label>
                                    <div className="itemsJustify">
                                        <Lock />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                                setFormData({ ...formData, password: e.target.value })
                                            }
                                            className="    inputCard"
                                            placeholder="Sua senha"
                                            required
                                        />
                                        <button
                                            className="absolute right-0  pr-6"
                                            type="button"
                                            onClick={(): void => setShowPassword(!showPassword)}

                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5 z-2" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className=" itemsJustify">
                                    <div className=" itemsJustify">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            checked={formData.rememberMe}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                                setFormData({ ...formData, rememberMe: e.target.checked })
                                            }
                                        />
                                        <Label htmlFor="remember">
                                            Lembrar de mim
                                        </Label>
                                    </div>
                                    <SimpleLink to="#" variant="navLink">
                                        Esqueceu a senha?
                                    </SimpleLink>
                                </div>

                                {error && (
                                    <div className="warningError">
                                        {error}
                                    </div>
                                )}

                                {/* Login Button */}
                                <div className="centralize2">
                                    <button
                                        type="submit"
                                        className="buttonPrimary "
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
                                </div>
                            </form>

                            <p className=" itemsJustify">
                                Não tem uma conta?
                                <a href="/cadastrar"
                                    className=" textLink"
                                >
                                    Cadastre-se aqui!
                                </a>
                            </p>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </>
    )
}

