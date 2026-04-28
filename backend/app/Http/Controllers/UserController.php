<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // GET /users → listar todos
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    // GET /users/{id} → mostrar 1 usuário
    public function show(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status'   => 'erro',
                'mensagem' => 'Usuário não encontrado.'
            ], 404);
        }

        return response()->json($user, 200);
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

    // POST /users → cadastrar usuário
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome'            => 'required|string|max:60',
            'email'           => 'required|email|unique:users,email',
            'senha'           => 'required|string|min:6',
            'tipo'            => 'in:admin,user',
            'data_nascimento' => 'nullable|date_format:Y-m-d',
            'telefone'        => 'nullable|string|max:30',
            'cidade'          => 'nullable|string|max:100',
            'objetivos'       => 'nullable|string',
            'areasInteresse'  => 'nullable|array', // ou string dependendo do formato
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'   => 'erro',
                'mensagem' => $validator->errors()
            ], 400);
        }

        $dados = $validator->validated();
        $dados['telefone'] = isset($dados['telefone']) ? preg_replace('/[^0-9]/', '', $dados['telefone']) : null;
        $dados['senha'] = Hash::make($dados['senha']);
        $dados['tipo'] = $dados['tipo'] ?? 'user';

        $user = User::create($dados);

        return response()->json([
            'status' => 'sucesso',
            'mensagem' => 'Usuário cadastrado com sucesso!',
            'user' => $user
        ], 201);
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
