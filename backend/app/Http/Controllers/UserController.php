<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Trilha;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // GET /users → listar todos
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    // GET /users/{id} → mostrar 1 usuário
    public function show(Request $request, String $id)
    {
        try {
            // O Laravel já injeta o usuário autenticado via Token no Request
            $user = $request->User();

            // Validamos se o usuário autenticado é o mesmo que ele está tentando ver (Segurança)
            if (!$user || $user->id != $id) {
                return response()->json(['status' => 'erro', 'mensagem' => 'Não autorizado.'], 403);
            }

            // Carrega a relação (ajuste 'trilhas' para o nome exato no seu Model User)
            // Usamos ->with('trilhas') para evitar o problema de N+1 consultas
            $user->load(['trilhas' => function ($query) {
                $query->orderBy('nome', 'asc');
            }]);

            // Mapeia os dados para manter o formato da sua resposta original
            return response()->json([
                'aluno' => [
                    'id' => $user->id,
                    'nome' => $user->nome,
                    'email' => $user->email,
                ],
                'trilhas' => $user->trilhas->map(function ($trilha) {
                    return [
                        'id' => $trilha->id,
                        'nome' => $trilha->nome,
                        'progresso' => $trilha->pivot->progresso ?? 0,
                    ];
                }),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'erro',
                'mensagem' => $e->getMessage(),
                'linha' => $e->getLine()
            ], 500);
        }
    }

    // GET /users/email/{email} → buscar por email
    public function findByEmail(string $email)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'erro',
                'mensagem' => 'Usuário não encontrado.'
            ], 404);
        }

        return response()->json($user, 200);
    }

    // PUT /users/{id} → editar usuário
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'erro',
                'mensagem' => 'Usuário não encontrado.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nome'            => 'nullable|string|max:60',
            'email'           => 'nullable|email|unique:users,email,' . $user->id,
            'senha'           => 'nullable|string|min:6',
            'tipo'            => 'nullable|in:admin,user',
            'data_nascimento' => 'nullable|date_format:Y-m-d',
            'telefone'        => 'nullable|string|max:30',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'   => 'erro',
                'mensagem' => $validator->errors()
            ], 400);
        }

        $dados = $validator->validated();

        if (isset($dados['telefone'])) {
            $dados['telefone'] = preg_replace('/[^0-9]/', '', $dados['telefone']);
        }

        if (isset($dados['senha'])) {
            $dados['senha'] = Hash::make($dados['senha']);
        }

        $user->update($dados);

        return response()->json([
            'status'   => 'sucesso',
            'mensagem' => 'Usuário atualizado com sucesso!',
            'user'    => $user
        ], 200);
    }

    // DELETE /users/{id} → deletar usuário
    public function destroy(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'erro',
                'mensagem' => 'Usuário não encontrado.'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'status' => 'sucesso',
            'mensagem' => 'Usuário deletado com sucesso.'
        ], 200);
    }
}
