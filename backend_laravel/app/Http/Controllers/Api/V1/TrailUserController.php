<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Trail;
use App\Http\Controllers\Controller;
use App\Models\TrailUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TrailUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    // Valida apenas a existência da trilha
    $validated = $request->validate([
        'trail_id' => ['required', 'integer', 'exists:trails,id'],
    ]);

    // Extrai o ID do usuário autenticado via Sanctum
    $userId = $request->user()->id;

    // Checa existência na tabela pivô
    $alreadyExists = TrailUser::where('trail_id', $validated['trail_id'])
        ->where('user_id', $userId)
        ->exists();

        if ($alreadyExists) {
            return response()->json([
                'status' => 'error',
                'message' => 'Você já está inscrito nesta trilha.'
            ], 409); // 409 Conflict
        }

        try {
            TrailUser::create([
                'trail_id' => $validated['trail_id'],
                'user_id' => $userId,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Inscrição realizada com sucesso!'
            ], 201); // 201 Created

        } catch (\Throwable $th) {
            Log::error('Falha ao criar instância de TrailUser', [
                'trail_id' => $validated['trail_id'],
                'user_id'  => $userId,
                'erro'     => $th->getMessage(),
                'arquivo'  => $th->getFile(),
                'linha'    => $th->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Erro interno ao processar inscrição. Tente mais tarde.'
            ], 500);
        }
    }
    /**
     * Retorna os dados da trilha e seus cursos associados.
     */

        public function show($id)
    {
        try {
            $trail = Trail::with('courses')->find($id);

            if (!$trail) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Trilha não encontrada.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'trail' => [
                        'id' => $trail->id,
                        'title' => $trail->name,
                        'is_custom' => !is_null($trail->user_id),
                        'courses' => $trail->courses,
                    ]
                ]
            ], 200);

        } catch (\Throwable $th) {
            Log::error('Erro ao buscar cursos da trilha', [
                'trail_id' => $id,
                'erro' => $th->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Erro interno ao carregar os dados da trilha.'
            ], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $pivot_id)
    {
        $instance = TrailUser::findOrFail($pivot_id);

        $validated = $request->validate([
            'progress' => ['required', 'string', 'in:Inscrito,Cursando,Suspenso,Concluído']
        ]);

        try {

            if ($instance->user_id === $request->user_id) {
                $instance->update($validated);

                return response()->json([
                    'progress' => $instance->progress,
                    'status' => 'success',
                    'message' => 'Progresso atualizado com sucesso.'
                ]);
            } else {

                return response()->json([
                    'status' => 'error',
                    'message' => 'Operação não permitida. Você não tem permissão para atualizar o progresso dessa instâcia.'
                ]);
            }
        } catch (\Throwable $th) {
            $statusCode = $th->getCode() ?: 500;

            Log::error('Falha ao atualizar instâcia de TrailUser', [
                'dados' => $validated,
                'erro'  => $th->getMessage(),
                'arquivo' => $th->getFile(),
                'linha'   => $th->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Não foi possível fazer essa operação. Erro interno (status: ' . $statusCode . '), tente mais tarde.'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TrailUser $trailUser)
    {
        $trailUser->delete();

        return response()->json([

            'status' => 'success',
            'message' => 'Trilha excluída com sucesso.'
        ]);

    }
}
