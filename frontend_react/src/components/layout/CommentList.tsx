import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface User {
    id: number;
    name: string;
}

interface Comment {
    id: number;
    user_id: number;
    course_id: number;
    content: string;
    user: User;
}

interface CommentsResponse {
    status: string;
    comments: Comment[];
}

interface CommentResponse {
    status: string;
    message: string;
    comment: Comment;
}

interface CommentListProps {
    Courseid: number | string;
    currentUserId?: number;
}

export default function CommentList({ Courseid, currentUserId }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await apiFetch<CommentsResponse>(`/comments?course_id=${Courseid}`);
                if (response.status === 'success' && response.data?.comments) {
                    setComments(response.data.comments);
                }
            } catch (error) {
                console.error('Erro ao buscar comentários:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchComments();
    }, [Courseid]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!content.trim()) return;

        setSending(true);
        try {
            const response = await apiFetch<CommentResponse>('/comments', {
                method: 'POST',
                body: JSON.stringify({ course_id: Courseid, content: content.trim() }),
            });

            if (response.status === 'success' && response.data?.comment) {
                setComments((prev) => [response.data!.comment, ...prev]);
                setContent('');
            }
        } catch (error) {
            console.error('Erro ao criar comentário:', error);
        } finally {
            setSending(false);
        }
    }

    async function handleUpdate(id: number) {
        if (!editContent.trim()) return;

        try {
            const response = await apiFetch<CommentResponse>(`/comments/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ content: editContent.trim() }),
            }); 

            if (response.status === 'success' && response.data?.comment) {
                setComments((prev) =>
                    prev.map((c) => (c.id === id ? response.data!.comment : c))
                );
                setEditingId(null);
                setEditContent('');
            }
        } catch (error) {
            console.error('Erro ao atualizar comentário:', error);
        }
    }

    async function handleDelete(id: number) {
        try {
            await apiFetch(`/comments/${id}`, { method: 'DELETE' });
            setComments((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            console.error('Erro ao deletar comentário:', error);
        }
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Comentários</h2>

            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Escreva um comentário..."
                    className="w-full min-h-[100px] p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 resize-none"
                    maxLength={1000}
                />
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={sending || !content.trim()}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                    >
                        {sending ? 'Enviando...' : 'Comentar'}
                    </button>
                </div>
            </form>

            {loading ? (
                <p>Carregando comentários...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-500">Nenhum comentário ainda.</p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    {comment.user.name}
                                </span>
                                
                                <div className="space-x-2 text-sm">
                                    <button
                                        onClick={() => {
                                            setEditingId(comment.id);
                                            setEditContent(comment.content);
                                        }}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </div>

                            {editingId === comment.id ? (
                                <div className="mt-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                                    />
                                    <div className="flex justify-end space-x-2 mt-2">
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1 bg-gray-400 text-white rounded"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(comment.id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded"
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                    {comment.content}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
