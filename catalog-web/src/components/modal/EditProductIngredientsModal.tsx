import {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import type {Ingredient, Product, ProductIngredientRequest} from "../../api/types.ts";
import {getIngredients} from "../../api/ingredients.ts";
import {updateProduct} from "../../api/products.ts";
import EntitySelector from "../product/EntitySelector.tsx";
import MeasurementTable, {type MeasurementTableRow} from "../product/MeasurementTable.tsx";
import {formatUnit, normalizeMeasurement} from "../../utils/units.ts";
import {strings} from "../../utils/localization.ts";

interface Props {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onUpdated: (product: Product) => void;
}

export default function EditProductIngredientsModal({
														open,
														product,
														onClose,
														onUpdated
													}: Props) {
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [rows, setRows] = useState<MeasurementTableRow[]>([]);

	useEffect(() => {
		async function load() {
			const data =
				await getIngredients();

			setIngredients(data);
			setSelectedIds(product!.ingredients.map((x) => x.ingredient.id));
			setRows(
				product!.ingredients.map(
					(x) => ({
						id: x.ingredient.id,
						label: x.ingredient.names[0]?.name ?? '',
						amount: x.amount,
						unit: formatUnit(x.unit_type.type)
					})
				)
			);
		}

		if (!open || !product)
			return;

		load();

	}, [open, product]);

	useEffect(() => {
		async function updateState() {
			const missing =
				selectedIds.filter((id) => !rows.some((x) => x.id === id));

			if (!missing.length)
				return;

			setRows((prev) => [
				...prev,
				...missing.map((id) => {
					const ingredient = ingredients.find((x) => x.id === id);

					return {
						id,
						label: ingredient?.names[0]?.name ?? '',
						amount: 0,
						unit: 'g'
					};
				})
			]);
		}

		updateState();
	}, [selectedIds]);

	function updateAmount(
		id: number,
		amount: number
	) {
		setRows((prev) =>
			prev.map((row) => {
				if (row.id !== id)
					return row;

				return {
					...row,
					amount
				};

			})
		);
	}

	function updateUnit(
		id: number,
		unit: string
	) {
		setRows((prev) =>
			prev.map((row) => {
				if (row.id !== id)
					return row;

				return {
					...row,
					unit
				};
			})
		);
	}

	function deleteRow(id: number) {
		setRows((prev) => prev.filter((x) => x.id !== id));
		setSelectedIds((prev) => prev.filter((x) => x !== id));
	}

	async function handleSave() {
		if (!product)
			return;

		const payload: ProductIngredientRequest[] =
			rows.map((row) => {
				const normalized = normalizeMeasurement(row.amount, row.unit);

				return {
					ingredient_id: row.id,
					amount: normalized.amount,
					unit_type_id: normalized.unit_type_id
				};
			});

		const updated = await updateProduct(product.id, {ingredients: payload});

		onUpdated(updated);
		onClose();
	}

	return (
		<Modal open={open} title={strings.ingredients_title} onClose={onClose}>
			<div className="space-y-6">
				<EntitySelector
					label={strings.ingredients_title}
					items={ingredients.map((x) => ({
						id: x.id,
						label: x.names[0]?.name ?? ''
					}))}
					selectedIds={selectedIds}
					onChange={setSelectedIds}
				/>

				<MeasurementTable
					rows={rows}
					onAmountChange={updateAmount}
					onUnitChange={updateUnit}
					onDelete={deleteRow}
				/>

				<div className="flex justify-end">
					<button
						onClick={handleSave}
						className="bg-black text-white px-4 py-2 rounded-xl"
					>
						{strings.save_button}
					</button>
				</div>
			</div>
		</Modal>
	);
}