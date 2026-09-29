import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface StarRatingProps {
    Courseid: number | string;
}

interface RatingResponse {
    data: {
        user_rating?: number;
        average_rating?: number;
        new_average?: number;
    };
    status: string;
    message?: string;
}

export default function StarRatingPage({ Courseid }: StarRatingProps) {
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [average, setAverage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        async function fetchRatings() {
            try {
                const data = await apiFetch(`/items/${Courseid}/ratings`, {
                    method: 'GET',
                }) as RatingResponse;

                console.log("Resposta da API:", data);
                console.log("Média recebida:", data.data.average_rating);

                setRating(data.data.user_rating || 0);
                setAverage(data.data.average_rating || 0);

            } catch (error) {
                console.error("Erro ao carregar avaliações", error);
            }
        }

        fetchRatings();
    }, [Courseid]);

    const handleRate = async (value: number) => {
        setLoading(true);

        try {
            const data = await apiFetch('/ratings', {
                method: 'POST',
                body: JSON.stringify({
                    Course_id: Courseid,
                    rating: value,
                }),
            }) as RatingResponse;

            console.log("Resposta ao avaliar:", data);

            setRating(value);

            if (data.data.average_rating !== undefined) {
                setAverage(data.data.average_rating);
            }

            setMessage('Avaliação salva com sucesso!');

            setTimeout(() => setMessage(''), 3000);

        } catch (error) {
            setMessage('Erro ao salvar avaliação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-sm bg-transparent space-y-2">
            <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Média geral: {average.toFixed(1)} / 5
                </p>
            </div>

            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={loading}
                        className={`text-2xl transition-colors ${
                            star <= (hover || rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                        } ${
                            loading
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                        }`}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                    >
                        ★
                    </button>
                ))}
            </div>

            {message && (
                <p className="text-xs text-green-600">
                    {message}
                </p>
            )}
        </div>
    );
}
