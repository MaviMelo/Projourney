<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();

        // Lista cursos do sistema (user_id null) e os cursos customizados do usuário logado
        $courses = Course::with('trails')
            ->where(function ($query) use ($userId) {
                $query->whereNull('user_id')
                      ->orWhere('user_id', $userId);
            })
            ->latest()
            ->paginate(25);

        $totalCourses = Course::whereNull('user_id')
            ->orWhere('user_id', $userId)
            ->count();

        return Inertia::render('dashboard', [
            'courses' => $courses,
            'activeView' => 'courses',
            'status' => [
                'total_courses' => $totalCourses,
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
        $userId = Auth::id();

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:150',
                // Garante unicidade do nome para o mesmo escopo (sistema ou usuário logado)
                Rule::unique('courses')->where(fn ($query) => $query->where('user_id', $userId))
            ],
            'level' => ['required', 'string', 'in:intermediário,básico,avançado'],
            'link_course' => ['required', 'string', 'max:250'],
        ]);

        try {
            $validated['user_id'] = $userId;
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
                'msg' => 'O curso não pôde ser criado. (Codigo: ' . $statusCode . ')',
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
        // Permite editar apenas se o curso for do usuário logado
        $course = Course::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('course/edit', compact('course'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Garante que o usuário só atualiza cursos que pertencem a ele
        $course = Course::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('courses')->where(fn ($query) => $query->where('user_id', Auth::id()))->ignore($course->id)
            ],
            'level' => ['required', 'string', 'in:básico,intermediário,avançado'],
            'link_course' => ['required', 'string', 'max:250'],
        ]);

        try {
            $course->update($validated);

            return redirect()->back()->with('message', [
                'status'  => 'success',
                'msg' => 'Curso ' . $validated['name'] . ' atualizado com sucesso.',
            ]);
        } catch (\Throwable $th) {
            $statusCode = $th->getCode() ?: 500;

            Log::error('Falha ao atualizar curso', [
                'dados' => $validated,
                'erro'  => $th->getMessage(),
                'arquivo' => $th->getFile(),
                'linha'   => $th->getLine(),
            ]);

            return redirect()->back()->with('message', [
                'status'  => 'error',
                'msg' => 'O curso não pôde ser atualizado. (Codigo: ' . $statusCode . ')',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        // Bloqueia caso o curso não pertença ao usuário logado (ex: cursos do sistema)
        if ($course->user_id !== Auth::id()) {
            abort(403, 'Ação não autorizada.');
        }

        try {
            $courseName = $course->name;
            $course->delete();

            return redirect()->back()->with('message', [
                'status'  => 'success',
                'msg' => 'Curso ' . $courseName . ' excluído com sucesso.',
            ]);
        } catch (\Throwable $e) {
            // Corrigido para chamar os métodos com parênteses corretos
            Log::error('Erro ao tentar excluir curso: ', [
                'Dados' => $course->toArray(),
                'Erro' => $e->getMessage(),
                'Arquivo' => $e->getFile(),
                'Linha' => $e->getLine(),
            ]);

            return redirect()->back()->with('message', [
                'status'  => 'error',
                'msg' => 'Erro ao tentar excluir o curso.',
            ]);
        }
    }
}
