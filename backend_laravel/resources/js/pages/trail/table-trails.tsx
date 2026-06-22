import { useRef, useState } from 'react';
import { Pencil, Trash2, Eye } from "lucide-react";
import { router, Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function TableTrails({ title, data }) {

    const modal = useRef(null);

    const [selectedTrail, setSelectedTrail] = useState(null);

    function openModal(trail: []) {
        setSelectedTrail(trail);
        modal.current.showModal();
    }

    function handleEdit(id: string) {
        router.get(route('trail.edit', id));
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
                    {data.length > 0 ? (
                        data.map((trail) => (
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

            <dialog className='card2 ' ref={modal}>
                {selectedTrail && (
                    <>
                        <p className="elementeCard1">Detalhes do Usuário:</p>

                        <ul>
                            <li>ID: {selectedTrail.id}</li>
                            <li>Nome: {selectedTrail.name}</li>
                        </ul>
                    </>
                )}
                <button className="button2" onClick={() => [setSelectedTrail(null), modal.current.close()]}>fechar X</button>
            </dialog>
        </>
    );
}