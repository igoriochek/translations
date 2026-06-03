import {api} from "./axios.ts";

import type {Category, TranslationInput} from "./types.ts";

export async function getCategories() {
	const response = await api.get<Category[]>('/categories');

	return response.data;
}

export async function createCategory(
	translations: TranslationInput[]
) {
	const response =
		await api.post<Category>('/admin/categories', {
			names: translations.map((x) => ({
				language_id: x.language_id,

				name: x.value
			}))
		});

	return response.data;
}

export async function updateCategory(id: number, translations: TranslationInput[]) {
	const response =
		await api.put<Category>(`/admin/categories/${id}`, {
				names: translations.map((x) => ({
					language_id: x.language_id,

					name: x.value
				}))
			}
		);

	return response.data;
}

export async function deleteCategory(id: number) {
	await api.delete(`/admin/categories/${id}`);
}