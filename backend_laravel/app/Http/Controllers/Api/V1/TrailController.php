<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
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
    public function indexpega()
    {
        // Aplica o scopeSystem() e traz os cursos associados
        $trails = Trail::system()
            ->with('courses')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => [
                'trails' => $trails
            ]
        ], 200);
    }
    /**
     * Página de Perfil: Exibe trilhas do sistema + trilhas personalizadas do usuário logado.
     */

    public function todocourse()
    {
        $user = Auth::user();

    // 1. Busca as trilhas em que o usuário está inscrito (via tabela pivô user_trails)
        $enrolledTrails = $user->trails()
            ->withPivot('id', 'progress')
            ->with('courses')
            ->get();

    // 2. Busca as trilhas criadas pelo próprio usuário (se não estiverem no grupo de inscritos)
        $createdTrails = Trail::where('user_id', $user->id)
            ->whereNotIn('id', $enrolledTrails->pluck('id'))
            ->with('courses')
            ->get();

    // 3. Unifica os dois conjuntos de dados
        $allUserTrails = $enrolledTrails->concat($createdTrails);

        return response()->json([
            'status' => 'success',
            'user'   => $user,
            'trails' => $allUserTrails
        ]);
    }

    // criar trilha
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
        ]);

        // Extrai o usuário autenticado via Sanctum/Request
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não autenticado.'
            ], 401);
        }

        try {
            // Atribui explicitamente o ID retornado pela autenticação
            $validated['user_id'] = $user->id;
            $trail = Trail::create($validated);

            // Insere a inscrição inicial na tabela pivô
            TrailUser::create([
                'user_id'  => $user->id,
                'trail_id' => $trail->id,
                'progress' => 'Inscrito',
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'A trilha ' . $trail->name . ' foi criada com sucesso.',
                'data'    => $trail
            ], 201);

        } catch (\Throwable $th) {
            Log::error('Erro ao criar trilha na API: ' . $th->getMessage());

            return response()->json([
                'status'  => 'error',
                'message' => 'Não foi possível criar a trilha.'
            ], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $trail = Trail::with('courses')->find($id);

            if (!$trail) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Trilha não encontrada.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'trail'  => [
                    'id'        => $trail->id,
                    'title'     => $trail->name,
                    'user_id'   => $trail->user_id,
                    'is_custom' => !is_null($trail->user_id),
                    'courses'   => $trail->courses,
                ]
            ], 200);

        } catch (\Throwable $th) {
            Log::error('Erro ao buscar cursos da trilha', [
                'trail_id' => $id,
                'erro'     => $th->getMessage()
            ]);

            return response()->json([
                'status'  => 'error',
                'message' => 'Erro interno ao carregar os dados da trilha.'
            ], 500);
        }
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


