import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function CreateUser() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        birth_date: '',
        fone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Head title="Cadastrar Usuário" />

            <div className="mb-6">
                <Link
                    href={route('dashboard')}
                    className="text-blue-600 hover:underline text-sm"
                >
                    ← Voltar ao Dashboard
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Usuário</h1>

            <form onSubmit={submit}>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1">
                            Data de nascimento (opcional)
                        </label>
                        <input
                            id="birth_date"
                            type="date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                            autoComplete="birth_date"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
                    </div>

                    <div>
                        <label htmlFor="fone" className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone (opcional)
                        </label>
                        <input
                            id="fone"
                            type="text"
                            value={data.fone}
                            onChange={(e) => setData('fone', e.target.value)}
                            autoComplete="tel"
                            placeholder="(11) 98888-8888"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.fone && <p className="text-red-500 text-sm mt-1">{errors.fone}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            autoComplete="new-password"
                            placeholder="Senha"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar senha
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            autoComplete="new-password"
                            placeholder="Confirmar senha"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? 'Cadastrando...' : 'Cadastrar usuário'}
                    </button>
                </div>
            </form>
        </div>
    );
}