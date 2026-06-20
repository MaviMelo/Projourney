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
                    className="buttonPrimary text-sm"
                >
                    ← Voltar ao Dashboard
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Usuário</h1>

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
                        <label htmlFor="fone" >
                            Telefone (opcional)
                        </label>
                        <input
                            id="fone"
                            type="text"
                            value={data.fone}
                            onChange={(e) => setData('fone', e.target.value)}
                            autoComplete="tel"
                            placeholder="(11) 98888-8888"
                            
                        />
                        {errors.fone && <p className="text-red-500 text-sm mt-1">{errors.fone}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" >
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
                            
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" >
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
                            
                        />
                        {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
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
        </div>
    );
}