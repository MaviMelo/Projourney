import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function EditCourse({ course }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: course.name || '',
        link_course: course.link_course || '',
        level: course.level || '',
    })

    const submit = (e) => {
        e.preventDefault();
        put(route('course.update', course.id), {
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

                <h1 className="text-2xl font-bold mb-6">Atualizar Dados do Curso {course.name} (ID: {course.id})</h1>

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
                            <label htmlFor="link_course" >
                                URL
                            </label>
                            <input
                                id="link_course"
                                type="text"
                                value={data.link_course}
                                onChange={(e) => setData('link_course', e.target.value)}
                                required
                                autoComplete="link_course"
                                placeholder="https://www.link_curso/exemplo.com.br"

                            />
                            {errors.link_course && <p className="text-red-500 text-sm mt-1">{errors.link_course}</p>}
                        </div>

                        <div>
                            <label htmlFor="level">
                                Nível do Curso
                            </label>
                            <select
                                id="level"
                                value={data.level}
                                onChange={(e) => setData('level', e.currentTarget.value)}
                            >
                                <option value="básico">Básico</option>
                                <option value="intermediário">Itermediário</option>
                                <option value="avançado">Avançado</option>
                            </select>
                            {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="button2"
                        >
                            {processing ? 'Cadastrando...' : 'Atualizar Curso'}
                        </button>
                    </div>
                </form>

                <div className='card1 '>

                    <p className="elementeCard1">Dados Atuais do Curso:</p>

                    <ul>
                        <li>ID: {course.id}</li>
                        <li>Nome: {course.name}</li>
                        <li>Nível: {course.level}</li>
                        <li>URL: {course.link_course}</li>
                    </ul>
                </div>
            </div>
        </>
    )
} 