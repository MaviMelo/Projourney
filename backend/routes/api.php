<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});


// 🌐 Health check simples (útil pra teste)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok'
    ]);
});


// ⚠️ CORS PRE-FLIGHT (resolve problema com fetch + JSON)
Route::options('{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');
