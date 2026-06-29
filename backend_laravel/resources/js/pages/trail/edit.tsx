import { Head, Link, useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function EditTrail({ trail, courses }) {
    const { data, setData, put, post, processing, errors, reset } = useForm({
        name: trail.name || '',
    })

    const submit = (e) => {
        e.preventDefault();
        put(route('trail.update', trail.id), {
            onSuccess: () => reset(),
        });
    };

    function addCourseToTrail(trailId: number, courseId: number) {
        const trailCourse: Record<string, number> = {
            "trail_id": trailId,
            "course_id": courseId
        }
        post(route('trailCourse.store', trailCourse), {

            onSuccess: () => {
                // Inertia.visit() //  Inertia.reload()
                const message: Record<string, string> = {
                    'status': 'success',
                    'msg': `A trilha ${trail.mane} foi criada com sucesso.`,
                }
            }
        });
    };

    function deleteCourseOfTrail(pivotId: number) {
        router.delete(route('trailCourse.destroy', pivotId));
    }

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

                <div className='card2 '>

                    <h2 className="elementeCard1">Dados Atuais da Trilha:</h2>

                    <ul>
                        <li>ID: {trail.id}</li>
                        <li>Nome: {trail.name}</li>
                    </ul>

                    <h2 className="elementeCard1">Cursos Associados:</h2>
                    <ul>

                        {trail.courses.length > 0 ? (trail.courses.map((course) => (
                            <div className="linkRed itemsJustify">
                                <li
                                    key={course.id}
                                >
                                    {course.name}
                                </li>
                                <button
                                onClick={() => deleteCourseOfTrail(course.pivot.id)}
                                >
                                    Excluir Curso (-)
                                </button>
                            </div>
                        ))
                        ) : (
                            <li>Nenhum curso associado.</li>
                        )}
                    </ul>

                </div>

                <div className='card1 '>

                    <h2 className="elementeCard1">Lista Geral de Cursos:</h2>
                    <ul>
                        {courses.length > 0 ? (courses.map((course) => (
                            <>
                                <div className="itemsJustify linkGreen">
                                    <li
                                        key={course.id}
                                    >
                                        <div>{course.id}. {course.name}</div>
                                        <div></div>
                                    </li>
                                    <button
                                        key={course.id}
                                        onClick={() => addCourseToTrail(trail.id, course.id)}
                                    >
                                        Adicionar à Trilha Atual (+)
                                    </button>
                                </div>
                            </>
                        ))
                        ) : (
                            <li>Nenhum curso para associar.</li>
                        )}
                    </ul>

                </div>
            </div>
        </>
    )
} 