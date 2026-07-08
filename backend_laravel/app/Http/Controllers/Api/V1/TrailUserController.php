<?php

namespace App\Http\Controllers\Api\V1;

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
        $validated = $request->validate([
            'trail_id' => ['required', 'integer'],
            'user_id' => ['required', 'integer']
        ]);

        $alreadyExists = TrailUser::where($validated)->exists();
        if ($alreadyExists) {
            return response()->json([
                'status' => 'error',
                'message' => 'Essa trilha já está na lista de trilhas desse usuário.'
            ]);
        };

        try {
            TrailUser::create($validated);
            return response()->json([
                'status' => 'success',
                'message' => 'Trilha adicionada.'
            ]);
        } catch (\Throwable $th) {
            $statusCode = $th->getCode() ?: 500;

            Log::error('Falha ao criar instâcia de TrailUser', [
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
     * Display the specified resource.
     */
    public function show(TrailUser $trailUser)
    {
        //
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
