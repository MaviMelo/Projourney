<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // login de fato, onde e passado os dados email e senha para entrada do saite
    public function login(Request $request)
    {
        // Validação (equivalente ao empty())
        $request->validate([
            'email' => 'required|email',
            'senha' => 'required'
        ]);

        try {
            // Busca usuário
            $user = User::where('email', $request->email)->first();

            // Verifica senha
            if ($user && Hash::check($request->password, $user->senha)) {

                return response()->json([
                    "status" => "sucesso",
                    "mensagem" => "Login realizado com sucesso!",
                    "dados_usuario" => [
                        "id" => $user->id,
                        "name" => $user->name
                    ]
                ], 200);
            }

            return response()->json([
                "status" => "erro",
                "mensagem" => "Credenciais inválidas. Verifique email e senha."
            ], 401);
        } catch (\Exception $e) {

            return response()->json([
                "status" => "erro",
                "mensagem" => "Erro no servidor."
            ], 500);
        }
    }

    // criação de login - cadastro de login
    public function store(Request $request)
    {
        // 1. Validação (substitui toda aquela lógica manual)
        $validated = $request->validate([
            'nome' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'senha' => 'required|string',
            'data_nascimento' => 'required|date_format:Y-m-d',
            'telefone' => 'required|string',
            'cidade' => 'nullable|string',
            'descricao' => 'nullable|string',
            'objetivos' => 'nullable|string',
            'areasInteresse' => 'nullable|string',
        ]);

        // 2. Tratamento dos dados
        $telefoneLimpo = preg_replace('/[^0-9]/', '', $validated['telefone']);

        // 3. Criar aluno
        $curso = User::create([
            'nome' => trim($validated['nome']),
            'email' => trim($validated['email']),
            'senha' => Hash::make($validated['senha']), // bcrypt/argon automático
            'data_nascimento' => $validated['data_nascimento'],
            'telefone' => $telefoneLimpo,
            'cidade' => $validated['cidade'] ?? null,
            'descricao' => $validated['descricao'] ?? null,
            'objetivos' => $validated['objetivos'] ?? null,
            'areasInteresse' => $validated['areasInteresse'] ?? null,
        ]);

        return response()->json([
            'status' => 'sucesso',
            'mensagem' => 'Aluno cadastrado com sucesso!',
            'data' => $curso
        ], 201);
    }
}
