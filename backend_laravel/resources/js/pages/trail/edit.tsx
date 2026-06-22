import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function EditTrail({ trail }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: trail.name || '',
    })

    const submit = (e) => {
        e.preventDefault();
        put(route('trail.update', trail.id), {
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

                <h1 className="text-2xl font-bold mb-6">Atualizar Dados da Trilha {trail.name} (ID: {trail.id})</h1>

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

                        <button
                            type="submit"
                            disabled={processing}
                            className="button2"
                        >
                            {processing ? 'Cadastrando...' : 'Atualizar Trilha'}
                        </button>
                    </div>
                </form>

                <div className='card1 '>

                    <p className="elementeCard1">Dados Atuais da Trilha:</p>

                    <ul>
                        <li>ID: {trail.id}</li>
                        <li>Nome: {trail.name}</li>
                    </ul>
                </div>
            </div>
        </>
    )
} 