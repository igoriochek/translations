import {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import type {Category, Product} from "../../api/types.ts";
import {getCategories} from "../../api/categories.ts";
import {updateProduct} from "../../api/products.ts";
import EntitySelector, {type EntitySelectorItem} from "../product/EntitySelector.tsx";

interface EditProductCategoriesModalProps {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onUpdated: (product: Product) => void;
}

export default function EditProductCategoriesModal({
													   open,
													   product,
													   onClose,
													   onUpdated
												   }: EditProductCategoriesModalProps) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open || !product)
			return;

		async function load() {
			const data = await getCategories();
			setCategories(data);
			setSelectedIds(product!.categories.map((x) => x.id));
		}

		load();
	}, [open, product]);

	async function handleSave() {
		if (!product)
			return;

		try {
			setLoading(true);

			const updated = await updateProduct(product.id, {categories: selectedIds});
			onUpdated(updated);
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	const items: EntitySelectorItem[] = categories.map((category) => ({
		id: category.id,
		label: category.names[0]?.name ?? `Category ${category.id}`
	}));

	return (
		<Modal open={open} title="Edit Categories" onClose={onClose}>
			<div className="space-y-6">
				<EntitySelector
					label="Categories"
					items={items}
					selectedIds={selectedIds}
					onChange={setSelectedIds}
				/>

				<div className="flex justify-end">
					<button onClick={handleSave} disabled={loading}
					        className="bg-black text-white px-4 py-2 rounded-xl">
						Save
					</button>
				</div>
			</div>
		</Modal>
	);
}