import { useRef, useState } from 'react';
import { Pencil, Trash2, Eye } from "lucide-react";
import { router, Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function TableUsers({ title, collection }) {

    const modal = useRef(null);

    const [selectedUser, setSelectedUser] = useState(null);

    function openModal(user: []) {
        setSelectedUser(user);
        modal.current.showModal();
    };

    function handleEdit(id: string) {
        router.get(route('user.edit', id));
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            router.delete(route('user.destroy', id), {
                onSuccess: () => {
                    // Opcional: Alguma lógica após sucesso
                },
            });
        };
    };
    /* 
        function closeModal() {
            setSelectedUser(null);
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
                        <th>Email</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {collection.data.length > 0 ? (
                        collection.data.map((user) => (
                            <tr key={user.id}>
                                <th>{user.id}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className="itemsJustify">
                                    <button
                                        className="linkRed"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Excluir
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        className="linkGreen"
                                        onClick={() => handleEdit(user.id)}
                                    >
                                        Editar
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        className="linkGreen"
                                        onClick={() => openModal(user)}
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
            { (
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
                {selectedUser && (
                    <>
                        <button className="button1" onClick={() => [setSelectedUser(null), modal.current.close()]}>x</button>
                        <p className="elementeCard1">Detalhes do Usuário:</p>

                        <ul>
                            <li>ID: {selectedUser.id}</li>
                            <li>Nome: {selectedUser.name}</li>
                            <li>Email: {selectedUser.email}</li>
                            <li>Data de nascimento: {selectedUser.birth_date}</li>
                            <li>Número de contato: {selectedUser.phone}</li>
                            <li>Nível de acesso: {selectedUser.role}</li>
                        </ul>
                    </>
                )}
            </dialog>
        </>
    );
}