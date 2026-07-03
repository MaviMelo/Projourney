<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Trail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use function Pest\Laravel\json;

class TrailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {

            $trails = Trail::all();
            return response()->json([
                'trails' => $trails,
                'status' => 'success',
                'message' => 'lista de trilhas'
            ]);
        } catch (\Throwable $th) {
            $statusCode = $th->getCode() ?: 500;

            Log::error('Falha ao buscar as trilhas', [
                'erro'  => $th->getMessage(),
                'arquivo' => $th->getFile(),
                'linha'   => $th->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Não foi possível fazer essa operação. Erro interno (status: ' . $statusCode . '), tente mais tarde.'
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Trail $trail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trail $trail)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trail $trail)
    {
        //
    }
}
