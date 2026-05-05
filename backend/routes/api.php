<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Aqui ficam apenas rotas de API (stateless)
*/

// 🔐 Autenticação
Route::post('/login', [AuthController::class, 'login']);
Route::post('/cadastrar_aluno', [AuthController::class, 'store']);

// 👤 Usuário autenticado (caso use Sanctum depois)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('user', UserController::class);
});


// 🌐 Health check simples (útil pra teste)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok'
    ]);
});
