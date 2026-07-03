<?php

/**
 *  Laravel Auth Docomentation: https://laravel.com/docs/13.x/authentication#protecting-routes
 */

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Auth;  // methods logic in vendor/laravel/framework/src/Illuminate/Auth/SessionGuard.php
use App\Models\User;
use DateTime;
use Laravel\Sanctum\HasApiTokens;


class AuthController extends Controller
{
    /**
     * Handle user registration.
     */
    public function register(Request $request)
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

        // $token = $user->createToken('projourney')->plainTextToken;

        return response()->json([
            'status' => 'success',
            // 'token' => $token,
            'message' => 'Cadastro de usuário relizado com sucesso.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {

            $user = Auth::user();
            // $user->makeHidden(['role']);
            $userData = $user->toArray();
            unset($userData['role']);


            $newToken = $user->createToken('projourney: ' . now())->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Login relizado com sucesso.',
                'token' => $newToken,
                'user' => $userData,
            ], 200);
        };

        return response()->json([
            'status' => 'error',
            'message' => 'Falha ao tentar login. Verifique suas credenciais e tente novamente.',

        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout realizado com sucesso.',
            'user' => null,
        ], 200);
    }

    public function fullLogout(Request $request)
    {
        // $user = User::find($request->id);

        // user already authenticed via middleware('auth:sanctum') in rout.    
        $user = $request->user();

        if (isset($user)) {
            $user->tokens()->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Logout realizado com sucesso em todos os dispositivos.',
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Usuário não autenticado.',
        ], 401);
    }

    public function profile(Request $request)
    {

        // $user = User::where('email', $request->email)->first();

        // user already authenticed via middleware('auth:sanctum') in rout.
        $user = Auth::user()->makeHidden('role');
        $user->load('trails');

        // Eager load trails with the pivot progress
/*         $user->load(['trails' => function ($query) {
            $query->withPivot('progress');
        }]);
 */


        // Attach the progress from the pivot to each trail object
/*         $user->trails->each(function ($trail) {
            $trail->progress = $trail->pivot->progress;
        });
 */
        if ($user) {

            return response()->json([
                'status' => 'success',
                'message' => 'Seja sempre bem vindo.',
                'user' => $user,
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não encontrado.',
            ], 404);
        }
    }
}
