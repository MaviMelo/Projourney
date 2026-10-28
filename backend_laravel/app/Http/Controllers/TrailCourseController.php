<?php
namespace App\Http\Controllers;

use App\Models\TrailCourse;
use App\Models\Trail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TrailCourseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'trail_id'  => ['required', 'integer', 'exists:trails,id'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
        ]);

        // Garante que a trilha pertença ao usuário logado (se for personalizada) ou permite acesso
        $trail = Trail::where('id', $validated['trail_id'])
            ->where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                      ->orWhereNull('user_id');
            })
            ->firstOrFail();

        $trailCourse = TrailCourse::firstOrCreate([
            'trail_id'  => $validated['trail_id'],
            'course_id' => $validated['course_id'],
        ]);

        if (!$trailCourse->wasRecentlyCreated) {
            return response()->json([
                'status'  => 'error',
                'message' => 'O curso já está associado a esta trilha.'
            ], 409);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Curso associado com sucesso.',
            'data'    => $trailCourse
        ], 201);
    }

    public function destroy(Request $request, int $id)
    {
        // $id é o ID da tabela pivô 'trail_courses' (ou busque por trail_id + course_id se preferir)
        $trailCourse = TrailCourse::where('id', $id)
            ->whereHas('trail', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->firstOrFail();

        $trailCourse->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Curso removido da trilha com sucesso.'
        ], 200);
    }
}
