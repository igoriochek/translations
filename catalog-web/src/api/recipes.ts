import {api} from "./axios.ts";
import type {Recipe, RecipeRequest} from "./types.ts";

export async function getRecipes() {
	const response = await api.get<Recipe[]>('/recipes');

	return response.data;
}

export async function getRecipesByIngredient(productId: number){
	const response = await api.get<Recipe[]>('/recipes/by-ingredients/' + productId);

	return response.data;
}

export async function createRecipe(recipe: RecipeRequest) {
	const response = await api.post<Recipe>('/admin/recipes', {
		names: recipe.names.map((x) => ({
			language_id: x.language_id,
			name: x.value
		})),
		contents: recipe.contents.map((x) => ({
			language_id: x.language_id,
			content: x.value
		})),
		ingredients: recipe.ingredients
	});

	return response.data;
}

export async function updateRecipe(id: number, recipe: RecipeRequest) {
	const response = await api.put<Recipe>(`/admin/recipes/${id}`, {
		names: recipe.names.map((x) => ({
			language_id: x.language_id,
			name: x.value
		})),
		contents: recipe.contents.map((x) => ({
			language_id: x.language_id,
			content: x.value
		})),
		ingredients: recipe.ingredients
	});

	return response.data;
}

export async function deleteRecipe(id: number): Promise<void> {
	await api.delete(`/admin/recipes/${id}`);
}