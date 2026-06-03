import {api} from "./axios.ts";

import type {NutritionalType, TranslationInput} from "./types.ts";

export async function getNutritionalTypes() {
	const response = await api.get<NutritionalType[]>('/nutrition-types');

	return response.data;
}

export async function createNutritionalType(translations: TranslationInput[]) {
	const response = await api.post<NutritionalType>('/admin/nutrition-types', {
			labels: translations.map((x) => ({
				language_id: x.language_id,
				label: x.value
			}))
		}
	);

	return response.data;
}

export async function updateNutritionalType(id: number, translations: TranslationInput[]) {
	const response = await api.put<NutritionalType>(`/admin/nutrition-types/${id}`, {
			labels: translations.map((x) => ({
				language_id: x.language_id,
				label: x.value
			}))
		}
	);

	return response.data;
}

export async function deleteNutritionalType(id: number): Promise<void> {
	await api.delete(`/admin/nutrition-types/${id}`);
}