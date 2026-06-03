import type {Language} from "./types.ts";
import {api} from "./axios.ts";

export async function getLanguages() : Promise<Language[]> {
	const response = await api.get<Language[]>(`/languages`);

	return response.data;
}

export async function createLanguage(name: string, code: string): Promise<Language> {
	const response = await api.post<Language>('/admin/languages', {name: name, code: code});

	return response.data;
}

export async function updateLanguage(language: Language): Promise<Language> {
	const response = await api.put<Language>(`/admin/languages/${language.id}`, language);

	return response.data;
}

export async function deleteLanguage(id: number): Promise<void> {
	await api.delete(`/admin/languages/${id}`);
}