import React, { useEffect, useState } from 'react';
import { User, Mail, Calendar, Phone, Shield, Save, Trash2, AlertCircle, CheckCircle, Edit3, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import ParticleBackground from "@/components/effects/particleBackground";
import { useNavigate } from 'react-router-dom';

interface UserData {
    id: number;
    name: string;
    email: string;
    birth_date?: string;
    phone?: string;
    role?: string;
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        birth_date: '',
        phone: '',
    });

    const fetchUser = async () => {
        setLoading(true);
        const response = await apiFetch<{ data: UserData }>('/user');
        
        if (response.status === 'success' && response.data?.data) {
            const userData = response.data.data;
            setUser(userData);
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                password: '',
                confirmPassword: '',
                birth_date: userData.birth_date || '',
                phone: userData.phone || '',
            });
        } else {
            setMessage({ type: 'error', text: response.message || 'Erro ao carregar dados do usuário.' });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (modalError) setModalError(null);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError(null);

        // Validação das senhas
        if (formData.password || formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                setModalError('As senhas digitadas não coincidem.');
                return;
            }
            if (formData.password.length < 6) {
                setModalError('A nova senha deve ter no mínimo 6 caracteres.');
                return;
            }
        }

        setSaving(true);
        setMessage(null);

        const payload: Record<string, string> = {};
        if (formData.name) payload.name = formData.name;
        if (formData.email) payload.email = formData.email;
        if (formData.password) payload.password = formData.password;
        if (formData.birth_date) payload.birth_date = formData.birth_date;
        if (formData.phone) payload.phone = formData.phone;

        const response = await apiFetch<{ data: UserData; message: string }>('/user', {
            method: 'PUT',
            body: JSON.stringify(payload),
        });

        if (response.status === 'success' && response.data) {
            setUser(response.data.data);
            setMessage({ type: 'success', text: response.data.message || 'Perfil atualizado com sucesso!' });
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            setIsEditModalOpen(false);
        } else {
            setMessage({ type: 'error', text: response.message || 'Erro ao atualizar perfil.' });
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Tem certeza que deseja apagar sua conta? Esta ação não pode ser desfeita.');
        if (!confirmed) return;

        const response = await apiFetch<{ message: string }>('/user', {
            method: 'DELETE',
        });

        if (response.status === 'success') {
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } else {
            setMessage({ type: 'error', text: response.message || 'Erro ao deletar conta.' });
        }
    };

    if (loading) {
        return (
            <>
                <ParticleBackground />
                <div className="min-h-screen flex items-center justify-center relative z-10">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </>
        );
    }

    return (
        <>
            <ParticleBackground />

            <main className="max-w-4xl mx-auto px-4 py-8 relative z-10 text-slate-100">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
                            <User size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">Meu Perfil</h1>
                            <p className="text-slate-400 text-sm">Gerencie suas informações pessoais e credenciais da conta.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-indigo-600/20 self-start sm:self-auto"
                    >
                        <Edit3 size={18} />
                        Editar Perfil
                    </button>
                </div>

                {/* Feedback Messages */}
                {message && (
                    <div className={`flex items-center gap-3 p-4 rounded-xl border mb-6 ${
                        message.type === 'success' 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                {/* Exibição dos Dados */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 mb-8">
                    <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-3 mb-6">Informações Pessoais</h2>
                    
                    {user && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-1">
                                <span className="text-xs text-slate-400 uppercase tracking-wider block">Nome Completo</span>
                                <span className="text-slate-200 font-medium">{user.name}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-400 uppercase tracking-wider block">Endereço de E-mail</span>
                                <span className="text-slate-200 font-medium break-all">{user.email}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-400 uppercase tracking-wider block">Data de Nascimento</span>
                                <span className="text-slate-200 font-medium">{user.birth_date || 'Não informada'}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-400 uppercase tracking-wider block">Telefone</span>
                                <span className="text-slate-200 font-medium">{user.phone || 'Não informado'}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-400 uppercase tracking-wider block">Função (Role)</span>
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                                    {user.role || 'Usuário'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Zona de Perigo */}
                <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-rose-400 font-semibold text-base">Zona de Perigo</h3>
                        <p className="text-slate-400 text-xs mt-1">Ao deletar sua conta, todos os seus dados e acessos serão desativados permanentemente.</p>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-rose-600/20 shrink-0"
                    >
                        <Trash2 size={18} />
                        Deletar Minha Conta
                    </button>
                </div>
            </main>

            {/* Modal de Atualização */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                        <button
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setModalError(null);
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
                            <p className="text-slate-400 text-xs mt-1">Atualize apenas os campos que desejar alterar.</p>
                        </div>

                        {modalError && (
                            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-400 text-xs font-medium">
                                <AlertCircle size={16} />
                                <span>{modalError}</span>
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Endereço de E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Campos de Senha Lado a Lado */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Nova Senha</label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirmar Nova Senha</label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Nascimento</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="date"
                                            name="birth_date"
                                            value={formData.birth_date}
                                            onChange={handleChange}
                                            className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Telefone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setModalError(null);
                                    }}
                                    disabled={saving}
                                    className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
