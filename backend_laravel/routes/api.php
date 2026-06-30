<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\TrailController;
use App\Http\Controllers\Api\V1\TrailUserController;
use Illuminate\Routing\ResolvesRouteDependencies;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->name('api.')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/fullLogout', [AuthController::class, 'fullLogout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::apiResources([
        'trail' => TrailController::class,
        'trailUser' => TrailUserController::class,
    ]);
});
