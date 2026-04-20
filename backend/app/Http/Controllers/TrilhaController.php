<?php

namespace App\Http\Controllers;

use App\Models\Trilha;
use Illuminate\Http\Request;

class TrilhaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'   => 'erro',
                'mensagem' => $validator->errors()
            ], 400);
        }

        $dados = $validator->validated();

        $trilha = Trilha::create($dados);

        return response()->json([
            'status'  => 'sucesso',
            'mensagem'=> 'Trilha criada com sucesso!',
            'trilha'   => $trilha
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Trilha $trilha)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Trilha $trilha)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trilha $trilha)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trilha $trilha)
    {
        //
    }
}
