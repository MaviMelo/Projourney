import { useState } from "react"
import type React from "react"
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Unlock, AlertCircle} from "lucide-react"
import { useNavigate } from "react-router-dom"
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

            <div className="formPage">

                <div className="backLinkWrap">
                    <SimpleLink to="/" variant="navLink">
                        <div className="backLinkInner">
                            <ArrowLeft className="backLinkIcon" />
                            <span className="backLinkText">Voltar ao início</span>
                        </div>
                    </SimpleLink>
                </div>

                {/* Título Principal */}
                <div className="pageIntro">
                    <h1 className="pageIntroTitle">
                        Bem-vindo de volta!
                    </h1>
                    <p className="pageIntroText">
                        Entre na sua conta para continuar aprendendo
                    </p>
                </div>

                <div className="formCard">

                    <div className="formHeader">
                        <Unlock className="formHeaderIcon" />
                        <h2 className="formHeaderTitle">
                            Entrar na Conta
                        </h2>
                        <p className="formHeaderText">
                            Digite suas credenciais para acessar sua conta
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="formBody">

                        {/* Campo de E-mail */}
                        <div className="formField">
                            <label htmlFor="email" className="formLabel">
                                E-mail *
                            </label>
                            <div className="formFieldWrap">
                                <Mail className="formFieldIcon" />
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder="seu@email.com"
                                    required
                                    className="formInput"
                                />
                            </div>
                        </div>

                        {/* Campo de Senha */}
                        <div className="formField">
                            <label htmlFor="password" className="formLabel">
                                Senha *
                            </label>
                            <div className="formFieldWrap">
                                <Lock className="formFieldIcon" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    placeholder="Sua senha"
                                    required
                                    className="formInput formInputPassword"
                                />
                                <button
                                    type="button"
                                    onClick={(): void => setShowPassword(!showPassword)}
                                    className="formPasswordToggle"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <div className="formRow">
                            <label className="formCheckLabel">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                        setFormData({ ...formData, rememberMe: e.target.checked })
                                    }
                                    className="formCheckbox"
                                />
                                Lembrar de mim
                            </label>

                            <SimpleLink to="#" variant="navLink">
                                Esqueceu a senha?
                            </SimpleLink>
                        </div>

                        {/* Mensagem de Erro formatada */}
                        {error && (
                            <div className="formError">
                                <AlertCircle size={20} />
                                <span className="formFeedbackText">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="formSubmit"
                        >
                            {isLoading ? (
                                <div className="formSubmitLoader">
                                    <div className="formSpinner" />
                                    <span>Entrando...</span>
                                </div>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </form>

                    <div className="formFooter">
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