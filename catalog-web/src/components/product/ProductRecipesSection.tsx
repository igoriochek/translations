import {useEffect, useState} from "react";
import type {
	Product,
	Recipe
} from "../../api/types.ts";
import {getRecipesByIngredient} from "../../api/recipes.ts";
import {strings} from "../../utils/localization.ts";

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
				{strings.recipes_title}
			</h2>

			{loading ? (
				<p className="text-zinc-500">
					{strings.products.loading_recipes}
				</p>
			) : recipes.length === 0 ? (
				<p className="text-zinc-500">
					{strings.products.no_recipes}
				</p>
			) : (
				<div className="space-y-2">
					{recipes.map(recipe => (
						<div
							key={recipe.id}
							className="flex p-3 rounded-xl border border-zinc-200"
						>
							{
								recipe.names[0]?.name ??
								strings.missing_field
							}
						</div>
					))}
				</div>
			)}
		</section>
	);
}