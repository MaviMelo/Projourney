<?php
namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Course;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    // Retorna a nota do usuário autenticado e a média geral do curso
    public function show(Request $request, $Courseid)
    {
        $userRating = Rating::where('user_id', $request->user()->id)
                            ->where('Course_id', $Courseid)
                            ->value('rating');

        $averageRating = Rating::where('Course_id', $Courseid)->avg('rating') ?? 0;

        return response()->json([
            'user_rating' => $userRating,
            'average_rating' => round($averageRating, 1),
        ]);
    }

    // Salva ou atualiza a avaliação e calcula a nova média
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Course_id' => 'required|exists:courses,id', // Corrigido para a tabela 'courses'
            'rating' => 'required|integer|min:1|max:5',
        ]);

        Rating::updateOrCreate(
            [
                'user_id' => $request->user()->id, 
                'Course_id' => $validated['Course_id']
            ],
            [
                'rating' => $validated['rating']
            ]
        );

        // Corrigido para 'Course_id' em vez de 'item_id'
        $newAverage = Rating::where('Course_id', $validated['Course_id'])->avg('rating');

        return response()->json([
            'message' => 'Avaliação salva com sucesso',
            'new_average' => round($newAverage, 1),
        ]);
    }
}