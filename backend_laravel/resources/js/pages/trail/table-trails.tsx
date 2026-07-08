import { useRef, useState } from 'react';
import { Pencil, Trash2, Eye } from "lucide-react";
import { router, Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function TableTrails({ title, collection }) {

    const modal = useRef(null);

    const [selectedTrail, setSelectedTrail] = useState(null);

    function openModal(trail: []) {
        setSelectedTrail(trail);
        modal.current.showModal();
    }

    function handleEdit(id: string) {
        router.get(route('trail.edit', id));
    }

    function handleEditCourses(id: string) {
        const courseEditUrl = route('course.edit', id);
        window.open(courseEditUrl, '_balnk');
    }

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este curso?')) {
            router.delete(route('trail.destroy', id), {
                onSuccess: () => {
                    // Opcional: Alguma lógica após sucesso
                },
            });
        };
    };
    /* 
        function closeModal() {
            setSelectedTrail(null);
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
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {collection.data.length > 0 ? (
                        collection.data.map((trail) => (
                            <tr key={trail.id}>
                                <th>{trail.id}</th>
                                <td>{trail.name}</td>
                                <td className="itemsJustify">
                                    <button
                                        className="linkRed"
                                        onClick={() => handleDelete(trail.id)}
                                    >
                                        Excluir
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        className="linkGreen"
                                        onClick={() => handleEdit(trail.id)}
                                    >
                                        Editar
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        className="linkGreen"
                                        onClick={() => openModal(trail)}
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
                {selectedTrail && (
                    <>
                        <button className="button1" onClick={() => [setSelectedTrail(null), modal.current.close()]}>x</button>
                        <p className="elementeCard1">Detalhes do Usuário:</p>

                        <ul>
                            <li>ID: {selectedTrail.id}</li>
                            <li>Nome: {selectedTrail.name}</li>
                        </ul>

                        <p className="elementeCard1">Cursos Associados:</p>
                        <ul>

                            {selectedTrail.courses && selectedTrail.courses.length > 0 ? (selectedTrail.courses.map((course) => (
                                <li>
                                    <button
                                        key={course.id}
                                        className="linkGreen2"
                                        onClick={() => handleEditCourses(course.id)}
                                    >
                                        {course.name}
                                    </button>

                                </li>
                            ))) : (
                                <li>Sem cursos associadas</li>
                            )}
                        </ul>
                    </>
                )}
            </dialog>
        </>
    );

}