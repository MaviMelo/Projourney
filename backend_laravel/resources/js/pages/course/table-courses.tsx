import { useRef, useState } from 'react';
import { Pencil, Trash2, Eye } from "lucide-react";
import { router, Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function TableCourses({ title, collection }) {

    const modal = useRef(null);

    const [selectedCourse, setSelectedCourse] = useState(null);

    function openModal(course: []) {
        setSelectedCourse(course);
        modal.current.showModal();
    }

    function handleEdit(id: string) {
        router.get(route('course.edit', id));
    }

    function handleEditTrail(id: string) {
        const trailEditUrl = route('trail.edit', id);
        window.open(trailEditUrl, '_balnk');
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este curso?')) {
            router.delete(route('course.destroy', id), {
                onSuccess: () => {
                    // Opcional: Alguma lógica após sucesso
                },
            });
        };
    };
    /* 
        function closeModal() {
            setSelectedCourse(null);
            modal.current.close();
        }

     */

    return (
        <>
            <table className="table-1">
                <caption className="title1">{title}</caption>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Nivel</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {collection.data.length > 0 ? (
                        collection.data.map((course) => (
                            <tr key={course.id}>
                                <th>{course.id}</th>
                                <td>{course.name}</td>
                                <td>{course.level}</td>
                                <td className="itemsJustify">
                                    <button
                                        className="linkRed"
                                        onClick={() => handleDelete(course.id)}
                                    >
                                        Excluir
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        className="linkGreen"
                                        onClick={() => handleEdit(course.id)}
                                    >
                                        Editar
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        className="linkGreen"
                                        onClick={() => openModal(course)}
                                    >
                                        Ver detalhes
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-4">Nenhum registro encontrado.</td>
                        </tr>

                    )}
                </tbody>
            </table>

            {/* PAGINAÇÃO */}
            {(
                <div className="itemsJustify">
                    <div>
                        {collection.links.map((link, index) => (
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-1 border rounded ${link.active ? 'bg-blue-500 text-white' : ' hover:bg-gray-500'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="px-3 py-1 border rounded text-gray-400 cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                </div>
            )}



            <dialog className='card2 ' ref={modal}>
                {selectedCourse && (
                    <>
                        <p className="elementeCard1">Detalhes do Curso:</p>

                        <ul>
                            <li>ID: {selectedCourse.id}</li>
                            <li>Nome: {selectedCourse.name}</li>
                            <li>Nivel: {selectedCourse.level}</li>
                            <li>URL:
                                <a
                                    className="linkGreen2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={selectedCourse.link_course}
                                >
                                    {selectedCourse.link_course}
                                </a>
                            </li>
                        </ul>

                        <p className="elementeCard1">Trilhas Atribuídas:</p>

                        <ul>
                            {selectedCourse.trails.length > 0 ? (selectedCourse.trails && selectedCourse.trails.map((trail) =>
                                <li>
                                    <button
                                        key={trail.id}
                                        className="linkGreen2"
                                        onClick={() => handleEditTrail(trail.id)}
                                        target="_blank"
                                    >
                                        {trail.name}
                                    </button>
                                </li>
                            )) : (<li>Nenhum trilha atribuida</li>)
                            }
                        </ul>


                    </>
                )}
                <button className="button2" onClick={() => [setSelectedCourse(null), modal.current.close()]}>fechar X</button>
            </dialog>
        </>
    );
}