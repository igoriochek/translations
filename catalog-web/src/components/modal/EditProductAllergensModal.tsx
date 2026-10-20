import {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import type {Allergen, Product} from "../../api/types.ts";
import {getAllergens} from "../../api/allergens.ts";
import {updateProduct} from "../../api/products.ts";
import EntitySelector, {type EntitySelectorItem} from "../product/EntitySelector.tsx";
import {strings} from "../../utils/localization.ts";

interface EditProductAllergensModalProps {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onUpdated: (product: Product) => void;
}

export default function EditProductAllergensModal({
													  open,
													  product,
													  onClose,
													  onUpdated
												  }: EditProductAllergensModalProps) {
	const [allergens, setAllergens] = useState<Allergen[]>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open || !product)
			return;

		async function load() {
			const data = await getAllergens();
			setAllergens(data);
			setSelectedIds(product!.allergens.map((x) => x.id));
		}

		load();
	}, [open, product]);

	async function handleSave() {
		if (!product)
			return;

		try {
			setLoading(true);

			const updated = await updateProduct(product.id, {allergens: selectedIds});
			onUpdated(updated);
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	const items: EntitySelectorItem[] = allergens.map((allergen) => ({
		id: allergen.id,
		label: allergen.names[0]?.name ?? `${strings.missing_field} #${allergen.id}`
	}));

	return (
		<Modal open={open} title={strings.products.edit_allergens_button} onClose={onClose}>
			<div className="space-y-6">
				<EntitySelector
					label={strings.allergens_title}
					items={items}
					selectedIds={selectedIds}
					onChange={setSelectedIds}
				/>

				<div className="flex justify-end">
					<button onClick={handleSave} disabled={loading}
					        className="bg-black text-white px-4 py-2 rounded-xl">
						{strings.save_button}
					</button>
				</div>
			</div>
		</Modal>
	);
}