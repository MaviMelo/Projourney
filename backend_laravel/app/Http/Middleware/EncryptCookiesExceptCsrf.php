<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as BaseEncryptCookies;

class EncryptCookiesExceptCsrf extends BaseEncryptCookies
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array<int, string>
     */
    protected $except = [
        'appearance',
        'sidebar_state',
        'XSRF-TOKEN',
    ];
}