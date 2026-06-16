<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
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
        // Only common users
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
        return Inertia::render('user/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'birth_date' => ['nullable', 'date', 'date_format:Y-m-d'],
            'fone' => ['nullable', 'string', 'max:30'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'birth_date' => $request->birth_date,
            'fone' => $request->fone,
        ]);

        return redirect()->route('dashboard')->with('message', [
            'status' => 'success',
            'msg' => 'Usuário cadastrado com sucesso.',
        ]);
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
    public function edit(string $id) {}

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
