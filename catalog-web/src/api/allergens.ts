import {api} from "./axios.ts";

import type {
	Allergen,
	TranslationInput
} from "./types.ts";

export async function getAllergens() {
	const response =
		await api.get<Allergen[]>(
			'/allergens'
		);

	return response.data;
}

export async function createAllergen(
	translations: TranslationInput[]
) {
	const response =
		await api.post<Allergen>(
			'/admin/allergens',
			{
				names: translations.map((x) => ({
					language_id: x.language_id,

					name: x.value
				}))
			}
		);

	return response.data;
}

export async function updateAllergen(
	id: number,
	translations: TranslationInput[]
) {
	const response =
		await api.put<Allergen>(
			`/admin/allergens/${id}`,
			{
				names: translations.map((x) => ({
					language_id: x.language_id,

					name: x.value
				}))
			}
		);

	return response.data;
}

export async function deleteAllergen(
	id: number
): Promise<void> {

	await api.delete(
		`/admin/allergens/${id}`
	);
}