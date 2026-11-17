<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Exibe os dados do usuário autenticado.
     */
    public function show(Request $request)
    {
        return response()->json([
            'data' => $request->user()
        ], 200);
    }

    /**
     * Atualiza os dados do usuário autenticado.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        $defaultAvatar = 'perfis/imagemPerfil.png';

        $validated = $request->validate([
            'name'       => ['sometimes', 'string', 'max:255'],
            'email'      => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password'   => ['sometimes', 'string', 'min:8'],
            'birth_date' => ['sometimes', 'nullable', 'date'],
            'phone'      => ['sometimes', 'nullable', 'string'],
            'avatar'     => ['sometimes', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar && $user->avatar !== $defaultAvatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Salva com hash único em storage/app/public/perfis/
            $validated['avatar'] = $request->file('avatar')->store('perfis', 'public');
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Usuário atualizado com sucesso.',
            'data'    => $user
        ], 200);
    }

    /**
     * Remove a conta do usuário autenticado.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        //deletar imagens
        Storage::disk('public')->delete($user->avatar);
        //deletar todo o usuario
        $user->delete();

        return response()->json([
            'message' => 'Usuário removido com sucesso.'
        ], 200);
    }
}
