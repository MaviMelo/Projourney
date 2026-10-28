<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::all();

        return response()->json([
            'status' => 'success',
            'data'   => ['courses' => $courses]
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'        => ['required', 'string', 'max:255'],
                'link_course' => ['required', 'url', 'max:255'],
                'level'       => ['required', Rule::in(['básico', 'intermediário', 'avançado'])],
            ]);

            $course = Course::create($validated);

            return response()->json([
                'status'  => 'success',
                'message' => 'Curso criado com sucesso.',
                'data'    => $course
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Dados inválidos.',
                'errors'  => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Erro interno ao criar curso: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Course $course)
    {
        return response()->json([
            'status' => 'success',
            'data'   => $course
        ], 200);
    }
}
