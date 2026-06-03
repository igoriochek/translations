import { api } from './axios';

export async function login(email: string, password: string) {

    const response = await api.post('/login', {
        email,
        password
    });

    return response.data;
}

export async function logout() {
    await api.post('/logout');
}

export async function getCurrentUser() {

    const response = await api.get('/me');

    return response.data;
}