
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function CreateTrail() {
    const { flash } = usePage().props;
    const trail = flash?.dbData || null;
    
    // console.log('Flash:', flash);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('trail.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <Head title="Criar Trilhas" />

                <div className="mb-6">
                    <Link
                        href={route('dashboard')}
                        className="buttonPrimary text-sm"
                    >
                        ← Voltar ao Dashboard
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-6">Criar Nova Trilha</h1>

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
                            {processing ? 'Cadastrando...' : 'Criar Trilha'}
                        </button>
                    </div>
                </form>
                {trail && (
                    <div className='card1 '>

                        <p className="elementeCard1">Trilha Criada:</p>

                        <ul>
                            <li>ID: {trail.id}</li>
                            <li>Nome: {trail.name}</li>
                        </ul>
                               <button
                        className="button1"
                        onClick={() => router.get(route('trail.edit', trail.id))}
                    >
                        Editar Esta Trilha
                    </button>
                    </div>
                )}
            </div>
        </>
    )
} 