import { BASE_URL } from '@/config/api';

interface ApiResponse<T = unknown> {
    data?: T;
    message?: string;
    status?: string;
}

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

async function refreshAccessToken(): Promise<string> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        const response = await fetch(`${BASE_URL}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            accessToken = null;
            localStorage.removeItem('token');
            localStorage.removeItem('loggedUser');
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        const data = await response.json();
        accessToken = data.token as string;
        localStorage.setItem('token', accessToken);
        return accessToken as string;
    })();

    try {
        const token = await refreshPromise;
        if (!token) throw new Error('Token não disponível');
        return token;
    } finally {
        refreshPromise = null;
    }
}

export async function apiFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = accessToken || localStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 && token) {
        try {
            const newToken = await refreshAccessToken();
            const retryHeaders: HeadersInit = {
                ...headers,
                'Authorization': `Bearer ${newToken}`,
            };
            const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers: retryHeaders,
            });
            const retryData = await retryResponse.json();
            return { data: retryData, status: retryResponse.ok ? 'success' : 'error', message: retryData.message };
        } catch {
            accessToken = null;
            localStorage.removeItem('token');
            localStorage.removeItem('loggedUser');
            window.location.href = '/login';
            throw new Error('Sessão expirada');
        }
    }

    const data = await response.json();
    return { data, status: response.ok ? 'success' : 'error', message: data.message };
}

export async function login(email: string, password: string): Promise<ApiResponse<{ user: { id: number; name: string; email: string }; token: string }>> {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
        accessToken = data.token;
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedUser', JSON.stringify(data.user));
    }

    return { data, status: response.ok ? 'success' : 'error', message: data.message };
}

export async function register(name: string, email: string, password: string, passwordConfirmation: string): Promise<ApiResponse<{ user: { id: number; name: string; email: string }; token: string }>> {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
        accessToken = data.token;
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedUser', JSON.stringify(data.user));
    }

    return { data, status: response.ok ? 'success' : 'error', message: data.message };
}

export async function logout(full = false): Promise<ApiResponse> {
    const token = accessToken || localStorage.getItem('token');
    if (!token) return { status: 'success' };

    const endpoint = full ? '/fullLogout' : '/logout';
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
    });

    accessToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('user');

    return { status: response.ok ? 'success' : 'error', message: (await response.json()).message };
}

export function initAuth(): void {
    const stored = localStorage.getItem('token');
    if (stored) accessToken = stored;
}