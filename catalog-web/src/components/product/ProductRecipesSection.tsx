import {useEffect, useState} from "react";
import type {
	Product,
	Recipe
} from "../../api/types.ts";
import {getRecipesByIngredient} from "../../api/recipes.ts";

interface ProductRecipesSectionProps {
	product: Product;
}

export default function ProductRecipesSection({product}: ProductRecipesSectionProps) {

	const [recipes, setRecipes] =
		useState<Recipe[]>([]);

	const [loading, setLoading] =
		useState(true);

	useEffect(() => {
		async function loadRecipes() {
			try {
				setLoading(true);

				const loadedRecipes = await getRecipesByIngredient(product.id);
				setRecipes(
					loadedRecipes
				);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		loadRecipes();
	}, [product.id]);

	return (
		<section className="bg-white rounded-2xl shadow-sm p-6">
			<h2 className="text-xl font-semibold mb-4">
				Recipes
			</h2>

			{loading ? (
				<p className="text-zinc-500">
					Loading recipes...
				</p>
			) : recipes.length === 0 ? (
				<p className="text-zinc-500">
					No recipes use this product.
				</p>
			) : (
				<div className="space-y-2">
					{recipes.map(recipe => (
						<div
							key={recipe.id}
							className="border rounded-lg p-3"
						>
							{
								recipe.names[0]?.name ??
								"Unnamed Recipe"
							}
						</div>
					))}
				</div>
			)}
		</section>
	);
}