<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || (auth()->user()->role !== 'admin' && auth()->user()->role !== 'root')){
            abort(403, 'Acesso não autorizado. Restrito aos colaboradores. Caso suas credenciais não funcionarem "passa lá no RH".');
        };
        return $next($request);
    }
}
