<?php

namespace App\Http\Controllers;

use App\Models\TrailCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TrailCourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'trail_id' => ['required', 'integer'],
            'course_id' => ['required', 'integer']
        ]);

        $existingTrailCourse = TrailCourse::where('trail_id', $validated['trail_id'])
            ->where('course_id', $validated['course_id'])
            ->first();

        if($existingTrailCourse){
            return redirect()->route('trail.edit', $validated['trail_id'])->with([
                'message' => [
                    'status' => 'error',
                    'msg' => 'O curso já está associado à trilha.'
                ]
            ]);
        }

        $trailCourse = TrailCourse::create($validated);

        return redirect()->route('trail.edit', $trailCourse->trail_id)->with([
            'message' => [
                'status' => 'success',
                'msg' => 'Curso adicionado à trilha com sucesso.'
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(TrailCourse $trailCourse)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TrailCourse $trailCourse)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TrailCourse $trailCourse)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {

        try {
            $trailCourse = TrailCourse::findOrFail($id);
            $trail = $trailCourse->trail_id;
            $trailCourse->delete();

            return redirect()->route('trail.edit', $trail)->with([
                'message' => [
                    'status' => 'success',
                    'msg' => 'Curso excluido da trilha com sucesso.'
                ]
            ]);
        } catch (\Throwable $th) {
            $statusCode = $th->getCode() ?: 500;

            Log::error('Falha ao excluir a instâcia de TrailCourse', [
                'dados' => $id,
                'erro'  => $th->getMessage(),
                'arquivo' => $th->getFile(),
                'linha'   => $th->getLine(),
            ]);

            return redirect()->back()->with([
                'message' => [
                    'status' => 'error',
                    'msg' => 'O curso não pôde ser exclúido. Tente novamente mais tarde (código: '.$statusCode.').'
                ]
            ]);
        }
    }
}
