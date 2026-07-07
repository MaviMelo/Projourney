import { BASE_URL } from '@/config/api';

const API_BASE = BASE_URL.replace(/\/api$/, '');

// ── Cookie helpers ──────────────────────────────────────────────────────────────

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1')}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function getXsrfToken(): string | null {
    return getCookie('XSRF-TOKEN');
}

// ── CSRF initialisation ────────────────────────────────────────────────────────

/**
 * Fetch a fresh CSRF cookie from Sanctum.
 * Must be called BEFORE any POST/PUT/DELETE request (login, register, logout).
 * The cookie is set automatically by the browser; subsequent requests send it
 * as the X-XSRF-TOKEN header.
 */
export async function initCsrf(): Promise<void> {
    await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
    });
}

/**
 * Legacy export kept for backwards compatibility in main.tsx.
 */
export async function initAuth(): Promise<void> {
    await initCsrf();
}

// ── Generic API fetch (session-based, no Bearer token) ─────────────────────────

interface ApiResponse<T = unknown> {
    data?: T;
    message?: string;
    status?: string;
}

export async function apiFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const method = (options.method || 'GET').toUpperCase();
    const needsCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(needsCsrf && { 'X-XSRF-TOKEN': getXsrfToken() ?? '' }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        method,
        headers,
        credentials: 'include',   // sends HttpOnly session cookie
    });

    const data = await response.json();
    return { data, status: response.ok ? 'success' : 'error', message: data.message };
}

// ── Auth endpoints ─────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<ApiResponse<{ user: { id: number; name: string; email: string } }>> {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getXsrfToken() ?? '',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.user) {
        localStorage.setItem('loggedUser', JSON.stringify(data.user));
    }

    return { data, status: response.ok ? 'success' : 'error', message: data.message };
}

export async function register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
): Promise<ApiResponse<{ user: { id: number; name: string; email: string } }>> {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getXsrfToken() ?? '',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
    });

    const data = await response.json();

    if (response.ok && data.user) {
        localStorage.setItem('loggedUser', JSON.stringify(data.user));
    }

    return { data, status: response.ok ? 'success' : 'error', message: data.message };
}

export async function logout(full = false): Promise<ApiResponse> {
    const endpoint = full ? '/fullLogout' : '/logout';
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getXsrfToken() ?? '',
        },
        credentials: 'include',
    });

    localStorage.removeItem('loggedUser');
    localStorage.removeItem('user');

    return { status: response.ok ? 'success' : 'error', message: (await response.json()).message };
}

// ── Exports for consumers that still reference these ────────────────────────────

/** @deprecated No bearer token used anymore; kept for code that checks it. */
export function getAccessToken(): string | null {
    return null;
}

/** @deprecated No bearer token used anymore; kept for code that calls it. */
export function setAccessToken(_token: string | null): void {
    // no-op
}