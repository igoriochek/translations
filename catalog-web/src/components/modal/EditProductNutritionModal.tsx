import {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import type {Product, NutritionalType, ProductNutritionRequest} from "../../api/types.ts";
import {getNutritionalTypes} from "../../api/nutritionalTypes.ts";
import {updateProduct} from "../../api/products.ts";
import EntitySelector from "../product/EntitySelector.tsx";
import MeasurementTable, {type MeasurementTableRow} from "../product/MeasurementTable.tsx";
import {formatUnit, normalizeMeasurement} from "../../utils/units.ts";
import {getLocalizedField, strings} from "../../utils/localization.ts";
import {useLanguage} from "../../utils/LanguageContext.tsx";

interface Props {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onUpdated: (product: Product) => void;
}

export default function EditProductNutritionModal({
													  open,
													  product,
													  onClose,
													  onUpdated
												  }: Props) {
	const [types, setTypes] = useState<NutritionalType[]>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [rows, setRows] = useState<MeasurementTableRow[]>([]);

	const { language } = useLanguage();

	useEffect(() => {
		async function load() {
			const data = await getNutritionalTypes();
			setTypes(data);
			setSelectedIds(product!.nutritional_measurements.map((x) => x.type.id));
			setRows(
				product!.nutritional_measurements.map(
					(x) => {
						const primaryName =
							getLocalizedField(language, x.type.labels.map(y => { return {
								language: y.language, field: y.label
							}}));

						return {
							id: x.type.id,
							label: primaryName?.field ?? strings.missing_field,
							amount: x.amount,
							unit: formatUnit(x.unit_type.type)
						}
					}
				)
			);
		}

		if (!open || !product)
			return;

		load();
	}, [open, product]);

	useEffect(() => {
		async function updateState() {
			const missing = selectedIds.filter((id) => !rows.some((x) => x.id === id));

			if (!missing.length)
				return;

			setRows((prev) => [
				...prev,
				...missing.map((id) => {
					const type = types.find((x) => x.id === id);
					const primaryName =
						getLocalizedField(language, type!.labels.map(y => { return {
							language: y.language, field: y.label
						}}));

					return {
						id,
						label: primaryName?.field ?? strings.missing_field,
						amount: 0,
						unit: 'g'
					};
				})
			]);
		}

		updateState();
	}, [selectedIds]);

	function updateAmount(id: number, amount: number) {
		setRows((prev) => prev.map((row) => row.id === id ? {...row, amount} : row));
	}

	function updateUnit(id: number, unit: string) {
		setRows((prev) => prev.map((row) => row.id === id ? {...row, unit} : row));
	}

	function deleteRow(id: number) {
		setRows((prev) => prev.filter((x) => x.id !== id));
		setSelectedIds((prev) => prev.filter((x) => x !== id));
	}

	async function handleSave() {
		if (!product)
			return;

		const payload: ProductNutritionRequest[] =
			rows.map((row) => {
				const normalized = normalizeMeasurement(row.amount, row.unit);
				return {
					nutritional_type_id: row.id,
					amount: normalized.amount,
					measurement_unit_type_id: normalized.unit_type_id
				};
			});

		const updated = await updateProduct(product.id, {nutritional_measurements: payload});
		onUpdated(updated);
		onClose();
	}

	return (
		<Modal open={open} title={strings.products.edit_nutrition_button} onClose={onClose}>
			<div className="space-y-6">
				<EntitySelector
					label={strings.products.nutritional_types}
					items={types.map((x) => {
						const primaryName =
							getLocalizedField(language, x.labels.map(y => { return {
								language: y.language, field: y.label
							}}));

						return {
							id: x.id,
							label: primaryName?.field ?? strings.missing_field,
						}
					})}
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
					<button onClick={handleSave} className="bg-black text-white px-4 py-2 rounded-xl">
						{strings.save_button}
					</button>
				</div>
			</div>
		</Modal>
	);
}