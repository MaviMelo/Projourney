import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function EditUser({ user }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        birth_date: user.birth_date || '',
        phone: user.phone || '',
        role: user.role || '',
    })

    const submit = (e) => {
        e.preventDefault();
        put(route('user.update', user.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <Head title="Cadastrar Usuário" />

                <div className="mb-6">
                    <Link
                        href={route('dashboard')}
                        className="buttonPrimary text-sm"
                    >
                        ← Voltar ao Dashboard
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-6">Atualizar Dados do Usuário {user.name} (ID: {user.id})</h1>

                <form onSubmit={submit} className="form1">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" >
                                Nome
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoFocus
                                autoComplete="name"
                                placeholder="Nome completo"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="email@exemplo.com"

                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="birth_date" >
                                Data de nascimento (opcional)
                            </label>
                            <input
                                id="birth_date"
                                type="date"
                                value={data.birth_date}
                                onChange={(e) => setData('birth_date', e.target.value)}
                                autoComplete="birth_date"

                            />
                            {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" >
                                Telefone (opcional)
                            </label>
                            <input
                                id="phone"
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                autoComplete="tel"
                                placeholder="(11) 98888-8888"

                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="role">
                                Tipo de Usuário
                            </label>
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.currentTarget.value)}
                            >
                                <option value="user">Usuário Comum</option>
                                <option value="admin">Administrador</option>
                                <option value="root">Root</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="button2"
                        >
                            {processing ? 'Cadastrando...' : 'Cadastrar usuário'}
                        </button>
                    </div>
                </form>

                <div className='card1 '>

                    <p className="elementeCard1">Dados Atuais do Usuário:</p>

                    <ul>
                        <li>ID: {user.id}</li>
                        <li>Nome: {user.name}</li>
                        <li>Data de Nascimento: {user.birth_date}</li>
                        <li>Email: {user.email}</li>
                        <li>Número de contato: {user.phone}</li>
                        <li>Tipo de Usuário: {user.role}</li>
                    </ul>
                </div>
            </div>
        </>
    )
} 