<?php

namespace App\Http\Controllers;

use App\Models\TrailCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TrailCourseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'trail_id'  => ['required', 'integer', 'exists:trails,id'],
        '   course_id' => ['required', 'integer', 'exists:courses,id'],
        ]);

        // Valida se a trilha pertence ao usuário logado (ou se é do sistema, se aplicável)
        $trail = Trail::where('id', $validated['trail_id'])
                    ->where('user_id', $request->user()->id)
                    ->firstOrFail();

        $trailCourse = TrailCourse::firstOrCreate([
            'trail_id'  => $validated['trail_id'],
            'course_id' => $validated['course_id'],
        ]);

        if (!$trailCourse->wasRecentlyCreated) {
            return back()->with(['message' => ['status' => 'error', 'msg' => 'O curso já está associado à trilha.']]);
        }

    return back()->with(['message' => ['status' => 'success', 'msg' => 'Curso adicionado com sucesso.']]);
    }

    public function destroy(Request $request, int $id)
    {
        // Busca a associação garantindo que a trilha pertença ao usuário autenticado
        $trailCourse = TrailCourse::where('id', $id)
            ->whereHas('trail', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->firstOrFail();

        $trailId = $trailCourse->trail_id;
        $trailCourse->delete();

        return redirect()->route('trail.edit', $trailId)->with([
            'message' => [
                'status' => 'success',
                'msg'    => 'Curso excluído da trilha com sucesso.',
            ]
        ]);
    }
}
