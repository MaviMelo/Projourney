<?php

namespace App\Http\Controllers;

use App\Models\Trail;
use App\Models\Course;
use App\Models\TrailUser;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrailController extends Controller
{
    /**
     * Página pública/geral de trilhas: Exibe APENAS as trilhas do sistema (user_id IS NULL).
     */
    public function index()
    {
        $trails = Trail::whereNull('user_id')
            ->with('courses')
            ->latest()
            ->paginate(25);

        return response()->json([
            'status' => 'success',
            'data' => [
                'trails' => $trails
            ]
        ]);
    }

    /**
     * Página de Perfil: Exibe trilhas do sistema + trilhas personalizadas do usuário logado.
     */
    public function profile()
    {
        $user = Auth::user();

        // Busca trilhas do sistema (user_id null) OU trilhas criadas pelo próprio usuário
        $trails = Trail::whereNull('user_id')
            ->orWhere('user_id', $user->id)
            ->get();

        $userProgressMap = TrailUser::where('user_id', $user->id)->get()->keyBy('trail_id');

        $userTrails = $trails->map(function ($trail) use ($userProgressMap, $user) {
            if (isset($userProgressMap[$trail->id])) {
                $progressRecord = $userProgressMap[$trail->id];
                $trail->pivot = [
                    'id' => $progressRecord->id,
                    'progress' => $progressRecord->progress,
                ];
            } else {
                $newProgress = TrailUser::create([
                    'user_id' => $user->id,
                    'trail_id' => $trail->id,
                    'progress' => 'Inscrito',
                ]);

                $trail->pivot = [
                    'id' => $newProgress->id,
                    'progress' => 'Inscrito',
                ];
            }

            return $trail;
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'trails' => $userTrails,
                ]
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('trail/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
        ]);

        try {
            $validated['user_id'] = Auth::id();
            $trail = Trail::create($validated);

            TrailUser::create([
                'user_id' => Auth::id(),
                'trail_id' => $trail->id,
                'progress' => 'Inscrito',
            ]);

            return redirect()->back()->with([
                'dbData' => $trail,
                'message' => [
                    'status' => 'success',
                    'msg' => 'A trilha ' . $trail->name . ' foi criada com sucesso.'
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

    public function show(Trail $trail)
    {
        //
    }

    public function edit(string $id)
    {
        $trail = Trail::with('courses')->findOrFail($id);
        $courses = Course::all();
        return Inertia::render('trail/edit', compact('trail', 'courses'));
    }

    public function update(Request $request, string $id)
    {
        $trail = Trail::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
        ]);

        try {
            $trail->fill($validated);
            $trail->save();

            return redirect()->back()->with([
                'dbData' => $trail,
                'message' => [
                    'status' => 'success',
                    'msg' => 'A trilha ' . $trail->name . ' foi atualizada com sucesso.'
                ]
            ]);
        } catch (\Throwable $th) {
            $statusCode = $th->getCode() ?: 500;
            Log::error('Erro ao tentar atualizar Trilha: ', [
                'Dados' => $trail,
                'Erro' => $th->getMessage(),
                'Arquivo' => $th->getFile(),
                'Linha' => $th->getLine(),
            ]);

            return redirect()->back()->with([
                'status' => 'error',
                'msg' => 'Não foi possível atualizar a trilha (codigo: ' . $statusCode . ').'
            ]);
        }
    }

    public function destroy(Trail $trail)
    {
        try {
            $trail->delete();
            return redirect()->back()->with('message', [
                'status'  => 'success',
                'msg' => 'Trilha ' . $trail->name . ' excluída com sucesso.',
            ]);
        } catch (\Throwable $e) {
            Log::error('Erro ao tentar excluir Trilha: ', [
                'Dados' => $trail,
                'Erro' => $e->getMessage(),
                'Arquivo' => $e->getFile(),
                'Linha' => $e->getLine(),
            ]);

            return redirect()->back()->with('message', [
                'status'  => 'error',
                'msg' => 'Erro ao tentar excluir a trilha.',
            ]);
        }
    }
}
