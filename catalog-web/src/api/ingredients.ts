import {api} from "./axios.ts";
import type {Ingredient, TranslationInput} from "./types.ts";

export async function getIngredients() {
	const response = await api.get<Ingredient[]>('/ingredients');

	return response.data;
}

export async function createIngredient(translations: TranslationInput[]) {
	const response = await api.post<Ingredient>('/admin/ingredients', {
			names: translations.map((x) => ({
				language_id: x.language_id,
				name: x.value
			}))
		}
	);

	return response.data;
}

export async function updateIngredient(id: number, translations: TranslationInput[]) {
	const response = await api.put<Ingredient>(`/admin/ingredients/${id}`, {
			names: translations.map((x) => ({
				language_id: x.language_id,
				name: x.value
			}))
		}
	);

	return response.data;
}

export async function deleteIngredient(id: number): Promise<void> {
	await api.delete(`/admin/ingredients/${id}`);
}