<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Trail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::with('trails')->latest()->paginate(25);

        return Inertia::render('dashboard', [
            'courses' => $courses,
            'activeView' => 'courses',
            'status' => [
                'total_courses' => Course::count(),
            ],

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('course/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150', 'unique:courses,name'],
            'level' => ['required', 'string', 'in:intermediário,básico,avançado'],
            'link_course' => ['required', 'string', 'max:250', 'unique:courses,link_course'],
        ]);

        try {
            $course = Course::create($validated);

            return redirect()->back()->with([
                'dbData' => $course,

                'message' => [
                    'status'  => 'success',
                    'msg' => 'Curso ' . $course->name . ' criado com sucesso.',
                ]
            ]);
        } catch (\Throwable $th) {
            $statusCode = $th->getCode() ?: 500;

            Log::error('Falha ao criar curso', [
                'dados' => $validated,
                'erro'  => $th->getMessage(),
                'arquivo' => $th->getFile(),
                'linha'   => $th->getLine(),
            ]);

            return redirect()->back()->with('message', [
                'status'  => 'error',
                'msg' => 'O curso ' . $validated['name'] . ' não pôde ser criado. (Codigo: ' . $statusCode . ')',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $course = Course::findOrFail($id);

        return inertia::render('course/edit', compact('course'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150', 'unique:courses,name,'. $id],
            'level' => ['required', 'string', 'in:básico,intermediário,avançado'],
            'link_course' => ['required', 'string', 'max:250', 'unique:courses,link_course,'.$id],
        ]);

        try {
            $course->fill($validated);
            $course->save();

            return redirect()->back()->with('message', [
                'status'  => 'success',
                'msg' => 'Curso ' . $validated['name'] . ' atualizado com sucesso.',
            ]);
        } catch (\Throwable $th) {
            $statusCode = $th->getCode() ?: 500;

            Log::error('Falha ao criar curso', [
                'dados' => $validated,
                'erro'  => $th->getMessage(),
                'arquivo' => $th->getFile(),
                'linha'   => $th->getLine(),
            ]);

            return redirect()->back()->with('message', [
                'status'  => 'error',
                'msg' => 'O curso ' . $validated['name'] . ' não pôde ser atualizado. (Codigo: ' . $statusCode . ')',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        try {
            $course = Course::findOrFail($course->id);
            $course->delete();

            return redirect()->back()->with('message', [
                'status'  => 'success',
                'msg' => 'Curso ' . $course->name . ' excluído com sucesso.',
            ]);
        } catch (\Throwable $e) {
            log::error('Erro ao tentar excluír curso: ', [
                'Dados: ' => $course,
                'Erro: ' => $e->getMessage,
                'Arquivo: ' => $e->getFile,
                'Linha: ' => $e->getLine,
            ]);

            return redirect()->back()->with('message', [
                'status'  => 'error',
                'msg' => 'Erro ao tentar excluir:',
            ]);
        }
    }
}
