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
            'course_id' => ['required', 'integer', 'exists:courses,id'],
        ]);

        // Evita duplicação de forma atômica
        $trailCourse = TrailCourse::firstOrCreate(
            [
                'trail_id'  => $validated['trail_id'],
                'course_id' => $validated['course_id'],
            ]
        );

        // Se o registro já existia (não foi recém-criado)
        if (!$trailCourse->wasRecentlyCreated) {
            return redirect()->route('trail.edit', $validated['trail_id'])->with([
                'message' => [
                    'status' => 'error',
                    'msg'    => 'O curso já está associado à trilha.',
                ]
            ]);
        }

        return redirect()->route('trail.edit', $trailCourse->trail_id)->with([
            'message' => [
                'status' => 'success',
                'msg'    => 'Curso adicionado à trilha com sucesso.',
            ]
        ]);
    }

    public function destroy(int $id)
    {
        $trailCourse = TrailCourse::findOrFail($id);
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
