import type {Product} from "../../api/types.ts";

interface ProductSellersSectionProps {
	product: Product;
}

export default function ProductSellersSection({product}: ProductSellersSectionProps) {

	return (<section className="bg-white rounded-2xl shadow-sm p-6">
			<h2 className="text-xl font-semibold mb-4">
				Sellers
			</h2>

			{product.sellers.length === 0 ? (
				<p className="text-zinc-500">
					No sellers.
				</p>
			) : (
				<div className="flex flex-wrap gap-2">
					{product.sellers.map(() => (
						<div className="flex flex-wrap gap-2">
							{product.sellers.map(sellerProduct => (
								<span
									key={sellerProduct.id}
									className="px-3 py-1 bg-zinc-100 rounded-full text-sm"
								>
									{sellerProduct.seller.name}
								</span>
							))}
						</div>))}
				</div>)}
		</section>);
}