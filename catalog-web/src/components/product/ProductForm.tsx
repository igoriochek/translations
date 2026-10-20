import {useEffect, useState} from "react";

import type {
	Allergen,
	Category,
	Ingredient,
	Language,
	Manufacturer,
	NutritionalType,
	Product,
	ProductIngredientRequest,
	ProductListItem,
	ProductNutritionRequest,
	TranslationInput
} from "../../api/types.ts";

import {getLanguages} from "../../api/languages.ts";
import {getManufacturers} from "../../api/manufacturers.ts";
import {getCategories} from "../../api/categories.ts";
import {getAllergens} from "../../api/allergens.ts";
import {getIngredients} from "../../api/ingredients.ts";
import {getNutritionalTypes} from "../../api/nutritionalTypes.ts";
import {createProduct, getAllProducts} from "../../api/products.ts";
import TranslationInputs from "../TranslationInputs.tsx";
import EntitySelector from "./EntitySelector.tsx";
import MeasurementTable, {type MeasurementTableRow} from "./MeasurementTable.tsx";
import ProductImageUploader from "./ProductImageUploader.tsx";
import {normalizeMeasurement} from "../../utils/units.ts";
import {strings} from "../../utils/localization.ts";

interface ProductFormProps {
	onCreated: (product: Product) => void;
}

export default function ProductForm({onCreated}: ProductFormProps) {
	const [languages, setLanguages] = useState<Language[]>([]);
	const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [allergens, setAllergens] = useState<Allergen[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [nutritionTypes, setNutritionTypes] = useState<NutritionalType[]>([]);
	const [products, setProducts] = useState<ProductListItem[]>([]);

	const [code, setCode] = useState<string>("");
	const [manufacturerId, setManufacturerId] = useState<number>(0);
	const [names, setNames] = useState<TranslationInput[]>([]);
	const [categoryIds, setCategoryIds] = useState<number[]>([]);
	const [allergenIds, setAllergenIds] = useState<number[]>([]);
	const [relatedProductIds, setRelatedProductIds] = useState<number[]>([]);
	const [ingredientRows, setIngredientRows] = useState<MeasurementTableRow[]>([]);
	const [nutritionRows, setNutritionRows] = useState<MeasurementTableRow[]>([]);
	const [images, setImages] = useState<File[]>([]);

	function syncIngredientRows(ids: number[]) {
		setIngredientRows((prev) => {
			const kept = prev.filter((row) => ids.includes(row.id));
			const missing =
				ids.filter((id) => !kept.some((row) => row.id === id));

			const additions =
				missing.map((id) => {
					const ingredient = ingredients.find((x) => x.id === id);
					return {
						id,
						label: ingredient?.names[0]?.name ?? '',
						amount: 0,
						unit: 'g'
					};
				});

			return [...kept, ...additions];
		});
	}

	function syncNutritionRows(ids: number[]) {
		setNutritionRows((prev) => {
			const kept = prev.filter((row) => ids.includes(row.id));
			const missing =
				ids.filter((id) => !kept.some((row) => row.id === id));

			const additions = missing.map((id) => {
				const type = nutritionTypes.find((x) => x.id === id);

				return {
					id,
					label: type?.labels[0]?.label ?? '',
					amount: 0,
					unit: 'g'
				};
			});
			return [...kept, ...additions];
		});
	}

	function updateIngredientAmount(id: number, amount: number) {
		setIngredientRows((prev) =>
			prev.map((row) => {
				if (row.id !== id)
					return row;

				return {...row, amount};
			})
		);
	}

	function updateIngredientUnit(id: number, unit: string) {
		setIngredientRows((prev) =>
			prev.map((row) => {
				if (row.id !== id)
					return row;

				return {...row, unit};
			})
		);
	}

	function deleteIngredientRow(id: number) {
		setIngredientRows((prev) =>
			prev.filter((x) => x.id !== id)
		);
	}

	function updateNutritionAmount(id: number, amount: number) {
		setNutritionRows((prev) =>
			prev.map((row) => {
				if (row.id !== id)
					return row;

				return {...row, amount};
			})
		);
	}

	function updateNutritionUnit(id: number, unit: string) {
		setNutritionRows((prev) =>
			prev.map((row) => {
				if (row.id !== id)
					return row;

				return {...row, unit};
			})
		);
	}

	function deleteNutritionRow(id: number) {
		setNutritionRows((prev) => 
			prev.filter((x) => x.id !== id));
	}

	useEffect(() => {

		async function load() {

			const [
				languagesData,
				manufacturersData,
				categoriesData,
				allergensData,
				ingredientsData,
				nutritionData,
				productsData
			] = await Promise.all([
				getLanguages(),
				getManufacturers(),
				getCategories(),
				getAllergens(),
				getIngredients(),
				getNutritionalTypes(),
				getAllProducts()
			]);

			setLanguages(languagesData);
			setManufacturers(manufacturersData);
			setCategories(categoriesData);
			setAllergens(allergensData);
			setIngredients(ingredientsData);
			setNutritionTypes(nutritionData);
			setProducts(productsData);

			setNames(languagesData.map((language) => ({
				language_id: language.id,
				value: ''
			})));
		}

		load();
	}, []);

	async function handleSubmit() {
		const ingredientPayload: ProductIngredientRequest[] =
			ingredientRows.map((row) => {
				const normalized = normalizeMeasurement(row.amount, row.unit);
				return {
					ingredient_id: row.id,
					amount: normalized.amount,
					unit_type_id: normalized.unit_type_id
				};
			});

		const nutritionPayload: ProductNutritionRequest[] =
			nutritionRows.map((row) => {
				const normalized = normalizeMeasurement(row.amount, row.unit);
				return {
					nutritional_type_id: row.id,
					amount: normalized.amount,
					measurement_unit_type_id: normalized.unit_type_id
				};
			});

		const formData = new FormData();
		formData.append('manufacturer_id', String(manufacturerId));
		formData.append('product_code', code);
		formData.append(
			'names',
			JSON.stringify(
				names.map((x) => ({
					language_id: x.language_id,
					name: x.value
				}))
			)
		);
		formData.append('categories', JSON.stringify(categoryIds));
		formData.append('allergens', JSON.stringify(allergenIds));
		formData.append('related_products', JSON.stringify(relatedProductIds));
		formData.append('ingredients', JSON.stringify(ingredientPayload));
		formData.append('nutritional_measurements', JSON.stringify(nutritionPayload));
		images.forEach((image) => formData.append('images[]', image));

		const product = await createProduct(formData);
		onCreated(product);
	}

	return (
		<div className="space-y-6 max-h-96 overflow-y-auto">
			<div>
				<label className="block text-sm font-medium mb-2">
					{strings.products.manufacturer_field}
				</label>

				<select
					value={manufacturerId}
					onChange={(e) =>
						setManufacturerId(Number(e.target.value))
					}
					className="w-full border border-zinc-200 rounded-xl px-4 py-3"
				>
					<option value={0}>
						{strings.products.manufacturer_prompt}
					</option>

					{manufacturers.map((manufacturer) => (
						<option key={manufacturer.id} value={manufacturer.id}>
							{manufacturer.name}
						</option>
					))}
				</select>

				<div>
					<label className="block text-sm font-medium mb-2">
						{strings.products.code_field}
					</label>

					<input
						type="text"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						className="w-full border border-zinc-200 rounded-xl px-4 py-3"
						placeholder={strings.products.code_placeholder}
					/>
				</div>
			</div>

			<TranslationInputs
				languages={languages}
				translations={names}
				onChange={setNames}
				label={strings.products.names_field}
			/>

			<EntitySelector
				label={strings.categories_title}
				items={categories.map((x) => ({
					id: x.id,
					label: x.names[0]?.name ?? ''
				}))}
				selectedIds={categoryIds}
				onChange={setCategoryIds}
			/>

			<EntitySelector
				label={strings.allergens_title}
				items={allergens.map((x) => ({
					id: x.id,
					label: x.names[0]?.name ?? ''
				}))}
				selectedIds={allergenIds}
				onChange={setAllergenIds}
			/>

			<EntitySelector
				label={strings.ingredients_title}
				items={ingredients.map((x) => ({
					id: x.id,
					label: x.names[0]?.name ?? ''
				}))}
				selectedIds={ingredientRows.map((x) => x.id)}
				onChange={syncIngredientRows}
			/>

			<MeasurementTable
				rows={ingredientRows}
				onAmountChange={updateIngredientAmount}
				onUnitChange={updateIngredientUnit}
				onDelete={deleteIngredientRow}
			/>

			<EntitySelector
				label={strings.nutritional_types_title}
				items={nutritionTypes.map((x) => ({
					id: x.id,
					label: x.labels[0]?.label ?? ''
				}))}
				selectedIds={
					nutritionRows.map((x) => x.id)
				}
				onChange={
					syncNutritionRows
				}
			/>

			<MeasurementTable
				rows={nutritionRows}
				onAmountChange={updateNutritionAmount}
				onUnitChange={updateNutritionUnit}
				onDelete={deleteNutritionRow}
			/>

			<EntitySelector
				label={strings.products.related_products}
				items={products.map((x) => ({
					id: x.id,
					label: x.names[0]?.name ?? ''
				}))}
				selectedIds={relatedProductIds}
				onChange={setRelatedProductIds}
			/>

			<ProductImageUploader
				onAdd={(files) =>
					setImages((prev) => [
						...prev,
						...files
					])
				}
			/>

			<div className="flex justify-end">
				<button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded-xl">
					{strings.create_button}
				</button>
			</div>
		</div>
	);
}