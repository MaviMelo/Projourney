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
        $validate = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'birth_date' => ['nullable', 'date', 'date_format:Y-m-d'],
            'fone' => ['nullable', 'string', 'max:30'],
        ]);

        $user = User::create([
            'name' => $validate['name'],
            'email' => $validate['email'],
            'birth_date' => $validate['birth_date'],
            'fone' => $validate['fone'],
            'password' => Hash::make($validate['password']),
        ]);

        return redirect()->route('dashboard')->with('message', [
            'status' => 'success',
            'msg' => 'Usuário "' . $user->name . '" cadastrado com sucesso.',
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
    public function edit(string $id) {

        $user = User::findOrFail($id);
        
        // dd($user);
        // logger($user);
        return Inertia::render('user/edit')->with(['user' => $user,]);
    }
    
    /**
     * Update the specified resource in storage.
    */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
            'birth_date' => ['nullable', 'date', 'date_format:Y-m-d'],
            'fone' => ['nullable', 'string', 'max:30'],
            'role' => ['required', 'string', 'in:user,admin,root']
        ]);

        // $user->name = $validate['name'];
        // $user->email = $validate['email'];
        // $user->birth_date = $validate['birth_date'];
        // $user->fone = $validate['fone'];
        // $user->role = $validate['role'];

        $user->fill($validated);

        $user->save();

        return redirect()->route('dashboard')->with('message', [
            'status' => 'success',
            'msg' => 'Usuário "'. $user->name .'" atualizado com sucesso.',
        ]);
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
