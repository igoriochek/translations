import {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import type {Product, ProductListItem} from "../../api/types.ts";
import {getAllProducts, updateProduct} from "../../api/products.ts";
import EntitySelector, {type EntitySelectorItem} from "../product/EntitySelector.tsx";

interface EditProductRelatedProductsModalProps {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onUpdated: (product: Product) => void;
}

export default function EditProductRelatedProductsModal({
															open,
															product,
															onClose,
															onUpdated
														}: EditProductRelatedProductsModalProps) {
	const [products, setProducts] = useState<ProductListItem[]>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open || !product)
			return;

		async function load() {
			const data = await getAllProducts();

			setProducts(data);
			setSelectedIds(product!.related_products.map((x) => x.id));
		}

		load();
	}, [open, product]);

	async function handleSave() {
		if (!product)
			return;

		try {
			setLoading(true);

			const updated = await updateProduct(product.id, {related_products: selectedIds});
			onUpdated(updated);
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	const items: EntitySelectorItem[] =
		products.filter((x) => x.id !== product?.id)
			.map((product) => ({
				id: product.id,
				label: product.names[0]?.name ?? `Product ${product.id}`
			}));

	return (
		<Modal open={open} title="Edit Related Products" onClose={onClose}>
			<div className="space-y-6">
				<EntitySelector
					label="Related Products"
					items={items}
					selectedIds={selectedIds}
					onChange={setSelectedIds}
				/>

				<div className="flex justify-end">
					<button onClick={handleSave} disabled={loading} className="bg-black text-white px-4 py-2 rounded-xl">
						Save
					</button>
				</div>
			</div>
		</Modal>
	);
}