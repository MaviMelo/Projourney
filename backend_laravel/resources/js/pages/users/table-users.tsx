import { Pencil, Trash2 } from "lucide-react";

export function TableUsers({ title, data, handleDelete }) {
    return (
        <table className="table-1">
            <caption className="title1">{title}</caption>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Data de nascimento</th>
                    <th>Telefone</th>
                    <th>Opções</th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((user) => (
                        <tr key={user.id}>
                            <th>{user.id}</th>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.birth_date}</td>
                            <td>{user.fone}</td>
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
                                    onClick={() => console.log('Editar', user.id)}
                                >
                                    Editar
                                    <Pencil size={16} />
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
    );
}