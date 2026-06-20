import { Form, Head } from '@inertiajs/react';
import { route } from 'ziggy-js';


export function CreateUser() {
    const { data, setData, post, processing, errors } = Form({
        name: '',
        email: '',
        birth_date: '',
        fone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user.store'));
    };

    return (
        <form onSubmit={submit}>
            <Head title="Cadastrar Usuário" />
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <label htmlFor="name">Nome</label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        placeholder="Full name"
                        className="border rounded px-3 py-2"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="grid gap-2">
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        tabIndex={2}
                        autoComplete="email"
                        placeholder="email@example.com"
                        className="border rounded px-3 py-2"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="grid gap-2">
                    <label htmlFor="email">Data de nascimento (opcional)</label>
                    <input
                        id="birth_date"
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                        required
                        tabIndex={2}
                        autoComplete="birth_date"
                        placeholder="dd/mm/aa"
                        className="border rounded px-3 py-2"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.birth_date}</p>}
                </div>

                <div className="grid gap-2">
                    <label htmlFor="email">Telefone</label>
                    <input
                        id="fone"
                        type="text"
                        value={data.fone}
                        onChange={(e) => setData('fone', e.target.value)}
                        required
                        tabIndex={2}
                        autoComplete="fone"
                        placeholder="(11) 98888-8888"
                        className="border rounded px-3 py-2"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.fone}</p>}
                </div>




                <div className="grid gap-2">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        tabIndex={3}
                        autoComplete="new-password"
                        placeholder="Password"
                        className="border rounded px-3 py-2"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div className="grid gap-2">
                    <label htmlFor="password_confirmation">Confirm password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        tabIndex={4}
                        autoComplete="new-password"
                        placeholder="Confirm password"
                        className="border rounded px-3 py-2"
                    />
                    {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation}</p>}
                </div>

                <button
                    type="submit"
                    className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
                    tabIndex={5}
                    disabled={processing}
                    data-test="register-user-button"
                >
                    {processing ? 'Criando...' : 'Create account'}
                </button>
            </div>
        </form>
    );
}