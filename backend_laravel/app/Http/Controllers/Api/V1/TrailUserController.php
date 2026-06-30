<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TrailUser;
use Illuminate\Http\Request;

class TrailUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'trail_id' => ['required', 'integer'],
            'user_id' => ['required', 'integer']
        ]);

        $alreadyExists = TrailUser::where($validated)->exists();
        if ($alreadyExists) {
            return response()->json([
                'status' => 'error',
                'message' => 'Essa trilha já está na lista de trilhas desse usuário.'
            ]);
        };

        try {
            TrailUser::create($validated);
            return response()->json([
                'status' => 'success',
                'message' => 'Trilha adicionada.'
            ]);
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(TrailUser $trailUser)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TrailUser $trailUser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TrailUser $trailUser)
    {
        //
    }
}
