<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/fullLogout', [AuthController::class, 'fullLogout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    // ... futuras rotas protegidas
});
