<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\TrailController;
use App\Http\Controllers\Api\V1\TrailUserController;
use App\Http\Controllers\Api\V1\CourseController;
use Illuminate\Routing\ResolvesRouteDependencies;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TrailCourseController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->name('api.')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/fullLogout', [AuthController::class, 'fullLogout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::get('/todocourse', [TrailController::class, 'todocourse']);
    Route::get('/index-pega', [TrailController::class, 'indexpega']);

    Route::apiResources([
        'trail' => TrailController::class,
        'course' => CourseController::class,
        'comments' => CommentController::class,
        'trail-users'=> TrailUserController::class,
    ]);

    Route::post('/trail-courses', [TrailCourseController::class, 'store']);
    Route::delete('/trail-courses/{id}', [TrailCourseController::class, 'destroy']);

    // Rotas de rating integradas no grupo autenticado e com o prefixo /api correto
    Route::get('/items/{Courseid}/ratings', [RatingController::class, 'show']);
    Route::post('/ratings', [RatingController::class, 'store']);
});
