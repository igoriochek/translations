import {useEffect, useState} from "react";
import type {ProductListItem, Seller, SellerProduct} from "../../api/types.ts";
import {getAllProducts} from "../../api/products.ts";
import {addRecommendations} from "../../api/sellers.ts";
import ProductSelector from "../ProductSelector.tsx";

interface AddRecommendationModalProps {
	open: boolean;
	sellerId: number;
	product: SellerProduct | null;
	onClose: () => void;
	onUpdated: (seller: Seller) => void;
}

export default function AddRecommendationModal({
												   open,
												   sellerId,
												   product,
												   onClose,
												   onUpdated
											   }: AddRecommendationModalProps) {
	const [products, setProducts] = useState<ProductListItem[]>([]);
	const [search, setSearch] = useState("");
	const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open || !product)
			return;

		async function loadProducts() {
			try {
				const data = await getAllProducts();

				setProducts(data);
				setSelectedProducts(product!.recommendations.map((x) => x.id));

			} catch (err) {

				console.error(err);
			}
		}

		loadProducts();
	}, [open, product]);

	if (!open || !product)
		return null;

	async function handleSubmit() {

		try {
			setLoading(true);

			const seller = await addRecommendations(sellerId, product!.id, selectedProducts);
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
						Edit Recommendations
					</h2>

					<p className="text-sm text-zinc-500 mt-1">
						Manage recommendations for{" "}
						{product.product.names[0]?.name}
					</p>
				</div>

				<ProductSelector
					products={products.filter((x) => x.id !== product.product.id)}
					search={search}
					onSearchChange={setSearch}
					selectedProducts={selectedProducts}
					onProductsChange={setSelectedProducts}
					label="Recommendations"
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
						{loading ? "Saving..." : "Save"}
					</button>
				</div>
			</div>
		</div>
	);
}