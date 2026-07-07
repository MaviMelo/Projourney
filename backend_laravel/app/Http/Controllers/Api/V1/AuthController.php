<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Handle user registration.
     * After registration, the user is logged in via session (HttpOnly cookie).
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'birth_date' => ['nullable', 'date', 'date_format:Y-m-d'],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'birth_date' => $request->birth_date,
            'phone' => $request->phone,
        ]);

        Auth::login($user);

        return response()->json([
            'status' => 'success',
            'message' => 'Cadastro de usuário realizado com sucesso.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 201);
    }

    /**
     * Handle login.
     * If the request has a session (SPA), uses session auth.
     * If the request has no session (CLI/Mobile), creates a Sanctum token.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Falha ao tentar login. Verifique suas credenciais e tente novamente.',
            ], 401);
        }

        $user = Auth::user();
        $userData = $user->toArray();
        unset($userData['role']);

        // For SPA requests, regenerate session
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        // For non-SPA clients (no session), return a Bearer token
        $token = null;
        if (!$request->hasSession() || !$request->session()->isStarted()) {
            $token = $user->createToken('projourney: ' . now())->plainTextToken;
        }

        $response = response()->json([
            'status' => 'success',
            'message' => 'Login realizado com sucesso.',
            'user' => $userData,
            'token' => $token,    // null for SPA, present for CLI/Mobile
        ], 200);

        return $response;
    }

    /**
     * Refresh the current access token (CLI/Mobile only).
     * SPA sessions are managed automatically by the framework.
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();

        if (method_exists($request->user(), 'currentAccessToken') && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
            $newToken = $user->createToken('projourney: ' . now())->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Token renovado.',
                'token' => $newToken,
            ]);
        }

        // SPA session refresh — just regenerate
        if ($request->hasSession()) {
            $request->session()->regenerate();

            return response()->json([
                'status' => 'success',
                'message' => 'Sessão renovada.',
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Nenhum token para renovar.',
        ], 400);
    }

    /**
     * Logout.
     * Destroys Bearer token (if present) AND invalidates session (if present).
     */
    public function logout(Request $request): JsonResponse
    {
        if (method_exists($request->user(), 'currentAccessToken') && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        if ($request->hasSession()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Logout realizado com sucesso.',
            'user' => null,
        ], 200);
    }

    /**
     * Full logout — all tokens + session.
     */
    public function fullLogout(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não autenticado.',
            ], 401);
        }

        $user->tokens()->delete();

        if ($request->hasSession()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Logout realizado com sucesso em todos os dispositivos.',
        ], 200);
    }

    /**
     * Get authenticated user profile.
     */
    public function profile(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não encontrado.',
            ], 404);
        }

        $user->makeHidden('role');
        $user->load('trails');

        return response()->json([
            'status' => 'success',
            'message' => 'Seja sempre bem vindo.',
            'user' => $user,
        ], 200);
    }
}