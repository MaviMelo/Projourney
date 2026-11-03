import { JSX, useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle, User, Mail, Lock, Calendar, Phone, Eye, EyeOff } from "lucide-react";
import ParticleBackground from "@/components/effects/particleBackground";
import SimpleLink from "../components/common/simpleLink";
import { register, initCsrf } from '@/lib/api';
interface AlunoFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    birth_date: string;
    phone_number: string; 
}

export default function CadastrarAlunoPage(): JSX.Element {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AlunoFormData>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        birth_date: "",
        phone_number: "", 
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
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
            await initCsrf();

            const response = await register(
                formData.name,
                formData.email,
                formData.password,
                formData.password_confirmation,
                formData.birth_date,
                formData.phone_number
            );


            if (response.status !== 'success') {
                throw new Error(response.message || `Erro no cadastro`);
            }

            setSuccess(response.message ?? 'Cadastro realizado com sucesso!');
            
            // Redireciona rapidamente para o login após sucesso
            setTimeout(() => {
                navigate('/login');
            }, 1000);

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

            <div className="formPage">

                {/* Botão de Voltar */}
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
                        Junte-se a nós!
                    </h1>
                    <p className="pageIntroText">
                        Crie sua conta e comece sua jornada
                    </p>
                </div>

                {/* Card de Registro */}
                <div className="formCard formCardWide">

                    <form onSubmit={handleSubmit} className="formBody">

                        {/* Grid de 2 Colunas */}
                        <div className="formGrid">

                            {/* Nome */}
                            <div className="formField">
                                <label htmlFor="name" className="formLabel">
                                    Nome Completo *
                                </label>
                                <div className="formFieldWrap">
                                    <User className="formFieldIcon" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Seu nome completo"
                                        required
                                        className="formInput"
                                    />
                                </div>
                            </div>

                            {/* E-mail */}
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
                                        onChange={handleChange}
                                        placeholder="seu@email.com"
                                        required
                                        className="formInput"
                                    />
                                </div>
                            </div>

                            {/* Senha */}
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
                                        onChange={handleChange}
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                        className="formInput formInputPassword"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="formPasswordToggle"
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar Senha */}
                            <div className="formField">
                                <label htmlFor="password_confirmation" className="formLabel">
                                    Confirmar Senha *
                                </label>
                                <div className="formFieldWrap">
                                    <Lock className="formFieldIcon" />
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="Repita sua senha"
                                        required
                                        className="formInput formInputPassword"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="formPasswordToggle"
                                    >
                                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            {/* Data de Nascimento */}
                            <div className="formField">
                                <label htmlFor="birth_date" className="formLabel">
                                    Data de Nascimento (Opcional)
                                </label>
                                <div className="formFieldWrap">
                                    <Calendar className="formFieldIcon" />
                                    <input
                                        id="birth_date"
                                        type="date"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                        className="formInput"
                                    />
                                </div>
                            </div>

                            {/* Telefone */}
                            <div className="formField">
                                <label htmlFor="phone_number" className="formLabel">
                                    Telefone (Opcional)
                                </label>
                                <div className="formFieldWrap">
                                    <Phone className="formFieldIcon" />
                                    <input
                                        id="phone_number"
                                        type="tel"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="(11) 99999-9999"
                                        className="formInput"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botão de Envio e Feedback */}
                        <div className="formActions">
                            {success && (
                                <div className="formSuccess">
                                    <CheckCircle size={20} />
                                    <span className="formFeedbackText">{success}</span>
                                </div>
                            )}
                            {error && (
                                <div className="formError">
                                    <AlertCircle size={20} />
                                    <span className="formFeedbackText">{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !!success}
                                className="formSubmit"
                            >
                                {loading ? <div className="formSpinner" /> : 'Finalizar Cadastro'}
                            </button>
                        </div>

                        {/* Link extra para Login */}
                        <div className="formFooter">
                            <span>Já possui uma conta?</span>
                            <SimpleLink to="/login" variant="navLink">
                                Entre aqui!
                            </SimpleLink>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}