import {useEffect, useState} from "react";

import type {
	ProductListItem,
	Seller
} from "../../api/types.ts";

import {getAllProducts} from "../../api/products.ts";
import {addSellerProduct} from "../../api/sellers.ts";

import ProductSelector from "../ProductSelector.tsx";

interface AddSellerProductModalProps {
	open: boolean;
	sellerId: number;
	onClose: () => void;
	onUpdated: (seller: Seller) => void;
}

export default function AddSellerProductModal({
												  open,
												  sellerId,
												  onClose,
												  onUpdated
											  }: AddSellerProductModalProps) {

	const [products, setProducts] = useState<ProductListItem[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open)
			return;

		async function loadProducts() {
			try {
				const data = await getAllProducts();
				setProducts(data);
			} catch (err) {
				console.error(err);
			}
		}

		loadProducts();
	}, [open]);

	if (!open)
		return null;

	async function handleSubmit() {
		const selected = selectedProducts[0];

		if (!selected)
			return;

		try {
			setLoading(true);

			const seller = await addSellerProduct(sellerId, selected);
			onUpdated(seller);
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl space-y-6">
				<div>
					<h2 className="text-xl font-bold">
						Add Product
					</h2>

					<p className="text-sm text-zinc-500 mt-1">
						Add a product to this seller.
					</p>
				</div>

				<ProductSelector
					products={products}
					search={search}
					onSearchChange={setSearch}
					selectedProducts={selectedProducts}
					onProductsChange={(products) => setSelectedProducts(products.slice(-1))}
					label="Product"
				/>

				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						disabled={loading}
						className="px-4 py-2 rounded-xl border border-zinc-200"
					>
						Cancel
					</button>

					<button
						onClick={handleSubmit}
						disabled={loading}
						className="bg-black text-white px-4 py-2 rounded-xl"
					>
						{loading ? "Adding..." : "Add"}
					</button>
				</div>
			</div>
		</div>
	);
}