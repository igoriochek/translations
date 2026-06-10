import {useEffect, useState} from "react";

import type {Language, ProductListItem, Recipe, RecipeRequest, TranslationInput} from "../api/types.ts";

import {getLanguages} from "../api/languages.ts";
import {getAllProducts} from "../api/products.ts";

import TranslationInputs from "./TranslationInputs.tsx";
import RecipeIngredientSelector from "./RecipeIngredientSelector.tsx";

interface RecipeFormProps {
	recipe?: Recipe;
	onSubmit: (request: RecipeRequest) => Promise<void>;
	onCancel?: () => void;
	submitText: string;
	loading: boolean;
}

export default function RecipeForm({
									   recipe,
									   onSubmit,
									   onCancel,
									   submitText,
									   loading
								   }: RecipeFormProps) {

	const [languages, setLanguages] = useState<Language[]>([]);
	const [products, setProducts] = useState<ProductListItem[]>([]);

	const [names, setNames] = useState<TranslationInput[]>([]);
	const [contents, setContents] = useState<TranslationInput[]>([]);

	const [search, setSearch] = useState('');

	const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);

	const [dataLoading, setDataLoading] = useState(true);

	useEffect(() => {

		async function loadData() {

			try {
				setDataLoading(true);

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
			} finally {
				setDataLoading(false);
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

	if (dataLoading) {
		return (
			<div className="space-y-6 animate-pulse">
				<div className="space-y-2">
					<div className="h-5 w-32 bg-gray-200 rounded"/>
					<div className="h-10 bg-gray-200 rounded"/>
					<div className="h-10 bg-gray-200 rounded"/>
				</div>

				<div className="space-y-2">
					<div className="h-5 w-40 bg-gray-200 rounded"/>
					<div className="h-32 bg-gray-200 rounded"/>
				</div>

				<div className="space-y-2">
					<div className="h-5 w-36 bg-gray-200 rounded"/>
					<div className="h-48 bg-gray-200 rounded"/>
				</div>

				<div className="flex justify-end gap-2">
					{onCancel && (
						<button
							type="button"
							onClick={onCancel}
							className="
							border
							px-4
							py-2
							rounded-lg
							text-sm
						">
							Cancel
						</button>
					)}
				</div>
			</div>
		);
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

			<div className="flex justify-end gap-2">
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						disabled={loading}
						className="
						border
						px-4
						py-2
						rounded-lg
						text-sm
						disabled:opacity-50
					">
						Cancel
					</button>
				)}

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
					disabled:opacity-50
				">
					{loading ? "Saving..." : submitText}
				</button>

			</div>

		</div>
	);
}