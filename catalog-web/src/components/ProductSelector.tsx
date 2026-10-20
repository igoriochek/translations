import {useMemo} from "react";
import type {ProductListItem} from "../api/types.ts";
import {strings} from "../utils/localization.ts";

interface ProductSelectorProps {
	products: ProductListItem[];

	search: string;
	onSearchChange: (value: string) => void;

	selectedProducts: number[];
	onProductsChange: (products: number[]) => void;

	label?: string;
}

export default function ProductSelector({
											products,
											search,
											onSearchChange,
											selectedProducts,
											onProductsChange,
											label = strings.products.products
										}: ProductSelectorProps) {

	const filteredProducts = useMemo(() => {
		if (!search.trim())
			return products;

		return products.filter((product) =>
			product.names.some((name) =>
				name.name.toLowerCase().includes(
					search.toLowerCase()
				)
			)
		);
	}, [products, search]);

	function addProduct(id: number) {

		if (selectedProducts.includes(id))
			return;

		onProductsChange([
			...selectedProducts,
			id
		]);
	}

	function removeProduct(id: number) {
		onProductsChange(selectedProducts.filter((x) => x !== id));
	}

	return (
		<div className="space-y-4">

			<h3 className="text-sm font-medium">
				{label}
			</h3>

			<input
				type="text"
				value={search}
				onChange={(e) =>
					onSearchChange(e.target.value)
				}
				placeholder={strings.sellers.search_products}
				className="w-full border border-zinc-200 rounded-xl px-4 py-3"
			/>

			<div className="max-h-48 overflow-y-auto border border-zinc-200 rounded-xl">
				{filteredProducts.map((product) => {
					const name = product.names[0]?.name ?? "Unnamed";

					return (
						<button
							key={product.id}
							type="button"
							onClick={() => addProduct(product.id)}
							className="w-full text-left px-4 py-2 hover:bg-zinc-100"
						>
							{name}
						</button>
					);
				})}
			</div>

			<div className="flex flex-wrap gap-2">
				{selectedProducts.map((id) => {
					const product =
						products.find(
							(x) => x.id === id
						);

					if (!product)
						return null;

					return (
						<div
							key={id}
							className="flex items-center gap-2 bg-zinc-100 rounded-full px-3 py-1"
						>
							<span>
								{product.names[0]?.name}
							</span>

							<button
								type="button"
								onClick={() => removeProduct(id)}
							>
								×
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}