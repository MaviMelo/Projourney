<?php

namespace App\Http\Controllers;

use App\Models\Trail;
use App\Models\Course;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;


class TrailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $trails = Trail::with('courses')->latest()->paginate(25);

        return Inertia::render('dashboard', [
            'trails' => $trails,
            'activeView' => 'trails',
            'status' => [
                'total_trails' => Trail::count(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('trail/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150', 'unique:trails,name'],
        ]);

        try {
            $trail = Trail::create($validated);

            return redirect()->back()->with([
                'dbData' => $trail,
                'message' => [
                    'status' => 'success',
                    'msg' => 'A trilha ' . $trail->mane . ' foi criada com sucesso.'
                ]
            ]);
        } catch (\Throwable $th) {
            $statusCode = $th->getCode() ?: 500;

            return redirect()->back()->with([
                'message' => [
                    'status' => 'error',
                    'msg' => 'Não foi possível criar a trilha (codigo: ' . $statusCode . ').'
                ]
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Trail $trail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $trail = Trail::with('courses')->findOrFail($id);
        $courses = Course::all();
        return Inertia::render('trail/edit', compact('trail', 'courses'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $trail = Trail::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150', 'unique:trails,name,' . $id],
        ]);

        try {
            $trail->fill($validated);
            $trail->save();

            return redirect()->back()->with([
                'dbData' => $trail,
                'message' => [
                    'status' => 'success',
                    'msg' => 'A trilha ' . $trail->mane . ' foi atualizada com sucesso.'
                ]
            ]);
        } catch (\Throwable $th) {
            $statusCode = $th->getCode() ?: 500;
            log::error('Erro ao tentar excluír Trilha: ', [
                'Dados: ' => $trail,
                'Erro: ' => $th->getMessage,
                'Arquivo: ' => $th->getFile,
                'Linha: ' => $th->getLine,
            ]);

            return redirect()->back()->with([
                'status' => 'error',
                'msg' => 'Não foi possível atualizar a trilha (codigo: ' . $statusCode . ').'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trail $trail)
    {
        try {
            $trail->delete();
            return redirect()->back()->with('message', [
                'status'  => 'success',
                'msg' => 'Curso ' . $trail->name . ' excluído com sucesso.',
            ]);
        } catch (\Throwable $e) {
            log::error('Erro ao tentar excluír Trilha: ', [
                'Dados: ' => $trail,
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
