import {useEffect, useState} from "react";

import type {
	Language,
	ProductListItem,
	Recipe,
	RecipeRequest,
	TranslationInput
} from "../api/types.ts";

import {getLanguages} from "../api/languages.ts";
import {getAllProducts} from "../api/products.ts";

import TranslationInputs from "./TranslationInputs.tsx";
import RecipeIngredientSelector from "./RecipeIngredientSelector.tsx";

interface RecipeFormProps {
	recipe?: Recipe;

	onSubmit: (request: RecipeRequest) => Promise<void>;

	submitText: string;

	loading: boolean;
}

export default function RecipeForm({
									   recipe,
									   onSubmit,
									   submitText,
									   loading
								   }: RecipeFormProps) {

	const [languages, setLanguages] = useState<Language[]>([]);
	const [products, setProducts] = useState<ProductListItem[]>([]);

	const [names, setNames] = useState<TranslationInput[]>([]);
	const [contents, setContents] = useState<TranslationInput[]>([]);

	const [search, setSearch] = useState('');

	const [selectedIngredients, setSelectedIngredients] =
		useState<number[]>([]);

	useEffect(() => {

		async function loadData() {

			try {

				const loadedLanguages =
					await getLanguages();

				const loadedProducts =
					await getAllProducts();

				setLanguages(loadedLanguages);
				setProducts(loadedProducts);

				if (!recipe) {

					setNames(
						loadedLanguages.map(
							(language) => ({
								language_id: language.id,
								value: ''
							})
						)
					);

					setContents(
						loadedLanguages.map(
							(language) => ({
								language_id: language.id,
								value: ''
							})
						)
					);

					return;
				}

				setNames(
					loadedLanguages.map(
						(language) => ({
							language_id: language.id,
							value:
								recipe.names.find(
									(x) =>
										x.language.id ===
										language.id
								)?.name ?? ''
						})
					)
				);

				setContents(
					loadedLanguages.map(
						(language) => ({
							language_id: language.id,
							value:
								recipe.contents.find(
									(x) =>
										x.language.id ===
										language.id
								)?.content ?? ''
						})
					)
				);

				setSelectedIngredients(
					recipe.ingredients.map(
						(x) => x.id
					)
				);

			} catch (err) {

				console.error(err);
			}
		}

		loadData();

	}, [recipe]);

	async function handleSubmit() {

		const invalidNames =
			names.some(
				(x) => !x.value.trim()
			);

		const invalidContents =
			contents.some(
				(x) => !x.value.trim()
			);

		if (
			invalidNames ||
			invalidContents
		)
			return;

		await onSubmit({
			names,
			contents,
			ingredients:
			selectedIngredients
		});
	}

	return (
		<div className="space-y-6">

			<TranslationInputs
				languages={languages}
				translations={names}
				onChange={setNames}
				label="Recipe Names"
				placeholder="Enter recipe name"
			/>

			<TranslationInputs
				languages={languages}
				translations={contents}
				onChange={setContents}
				label="Recipe Contents"
				placeholder="Enter recipe content"
				multiline
			/>

			<RecipeIngredientSelector
				products={products}
				search={search}
				onSearchChange={setSearch}
				selectedIngredients={
					selectedIngredients
				}
				onIngredientsChange={
					setSelectedIngredients
				}
			/>

			<div className="flex justify-end">

				<button
					type="button"
					onClick={handleSubmit}
					disabled={loading}
					className="
						bg-black
						text-white
						px-4
						py-2
						rounded-lg
						text-sm
					"
				>
					{submitText}
				</button>

			</div>

		</div>
	);
}