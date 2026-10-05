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
    comments: Comment[];
}

interface CommentResponse {
    message: string;
    comment: Comment;
}

interface CommentListProps {
    Courseid: number | string;
}

export default function CommentList({ Courseid }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Buscar comentários
    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await apiFetch<CommentsResponse>(
                    `/courses/${Courseid}/comments`
                );

                if (response.status === 'success' && response.data) {
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

    // Criar comentário
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!content.trim()) {
            return;
        }

        setSending(true);

        try {
            const response = await apiFetch<CommentResponse>(
                '/comments',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        course_id: Courseid,
                        content: content.trim(),
                    }),
                }
            );

            if (
                response.status === 'success' &&
                response.data
            ) {
                setComments((prev) => [
                    response.data!.comment,
                    ...prev,
                ]);

                setContent('');
            } else {
                console.error(
                    response.message || 'Erro ao criar comentário'
                );
            }

        } catch (error) {
            console.error('Erro ao criar comentário:', error);
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="w-full">

            <h2 className="text-xl font-semibold mb-4">
                Comentários
            </h2>

            {/* Criar comentário */}
            <form
                onSubmit={handleSubmit}
                className="mb-6"
            >
                <textarea
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
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
                        {sending
                            ? 'Enviando...'
                            : 'Comentar'}
                    </button>
                </div>
            </form>

            {/* Lista de comentários */}
            {loading ? (
                <p>Carregando comentários...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-500">
                    Nenhum comentário ainda.
                </p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        >
                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                {comment.user.name}
                            </p>

                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                {comment.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
