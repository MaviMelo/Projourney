<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::where('role', 'user')->latest()->paginate(15);

        return Inertia::render('dashboard', [
            'users' => $users,
            'activeView' => 'users',
            'stats' => [
                'total_users' => User::where('role', 'user')->count(),
                'total_collaborators' => User::whereIn('role', ['admin', 'root'])->count(),
            ],
        ]);
    }

    public function indexCollaborators()
    {
        $users = User::whereIn('role', ['root', 'admin'])->latest()->paginate(15);

        return Inertia::render('dashboard', [
            'users' => $users,
            'activeView' => 'collaborators',
            'stats' => [
                'total_users' => User::where('role', 'user')->count(),
                'total_collaborators' => User::whereIn('role', ['admin', 'root'])->count(),
            ],
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Optional: authorize via Gate or Policy
        // $this->authorize('delete', $user);


        try {
            $user = User::findOrFail($id);
            $user->delete();

            return redirect()->back()->with('message', [
                'status'  => 'success',
                'msg' => 'Usuário ID nº ' . $id . ' excluído com sucesso.',
            ]);
            /*      } catch (ModelNotFoundException) {
            return Inertia::render('dashboard', [
                'message' => [
                    'status'  => 'error',
                    'msg' => 'Usuário não encontrado.',
                ]
            ]); */
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'status'  => 'error',
                'msg' => 'Erro ao tentar excluir: ' . $e->getMessage(),
            ]);
        }
    }
}
