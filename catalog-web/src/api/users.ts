import type {User} from "./types.ts";
import {api} from "./axios.ts";

export async function getAdmins(): Promise<User[]> {
	const response = await api.get(`/admin/users`);

	return response.data;
}

export async function createAdmin(name: string, email: string, password: string): Promise<User> {
	const response = await api.post(`/admin/users`, {name, email, password});

	return response.data;
}

export async function deleteAdmin(id: number): Promise<void> {
	await api.delete(`/admin/users/${id}`);
}