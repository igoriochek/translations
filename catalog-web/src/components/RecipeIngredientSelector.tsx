import {useMemo} from "react";
import type {ProductListItem} from "../api/types.ts";
import {strings} from "../utils/localization.ts";

interface RecipeIngredientSelectorProps {
	products: ProductListItem[];

	search: string;
	onSearchChange: (value: string) => void;

	selectedIngredients: number[];
	onIngredientsChange: (ingredients: number[]) => void;
}

export default function RecipeIngredientSelector({
													 products,
													 search,
													 onSearchChange,
													 selectedIngredients,
													 onIngredientsChange
												 }: RecipeIngredientSelectorProps) {

	const filteredProducts = useMemo(() => {

		if (!search.trim())
			return products;

		return products.filter((product) =>
			product.names.some((name) =>
				name.name.toLowerCase().includes(
					search.toLowerCase()
				)
			)
		);

	}, [products, search]);

	function addIngredient(id: number) {

		if (selectedIngredients.includes(id))
			return;

		onIngredientsChange([
			...selectedIngredients,
			id
		]);
	}

	function removeIngredient(id: number) {
		onIngredientsChange(
			selectedIngredients.filter(
				(x) => x !== id
			)
		);
	}

	return (
		<div className="space-y-3">

			<h3 className="text-sm font-medium">
				{strings.products_title}
			</h3>

			<input
				type="text"
				value={search}
				onChange={(e) =>
					onSearchChange(e.target.value)
				}
				placeholder={strings.recipes.product_search}
				className="
					w-full
					border
					border-zinc-200
					rounded-xl
					px-4
					py-3
				"
			/>

			<div className="max-h-48 overflow-y-auto border border-zinc-200 rounded-xl">

				{filteredProducts.map((product) => {

					const name =
						product.names[0]?.name ??
						strings.missing_field;

					return (
						<button
							key={product.id}
							type="button"
							onClick={() =>
								addIngredient(
									product.id
								)
							}
							className="
								w-full
								text-left
								px-4
								py-2
								hover:bg-zinc-100
							"
						>
							{name}
						</button>
					);
				})}

			</div>

			<div className="flex flex-wrap gap-2">

				{selectedIngredients.map((id) => {

					const product =
						products.find(
							(x) => x.id === id
						);

					if (!product)
						return null;

					return (
						<div
							key={id}
							className="
								flex
								items-center
								gap-2
								bg-zinc-100
								rounded-full
								px-3
								py-1
							"
						>

							<span>
								{product.names[0]?.name}
							</span>

							<button
								type="button"
								onClick={() =>
									removeIngredient(id)
								}
							>
								×
							</button>

						</div>
					);

				})}

			</div>

		</div>
	);
}