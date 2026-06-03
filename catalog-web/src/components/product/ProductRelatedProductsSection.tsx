import {Link} from "react-router-dom";

import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";

interface ProductRelatedProductsSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductRelatedProductsSection({product, onEdit}: ProductRelatedProductsSectionProps) {
	return (
		<ProductSection title="Related Products" onEdit={onEdit}>
			<div className="space-y-2">
				{product.related_products.map((related) => (
					<Link
						key={related.id}
						to={`/products/${related.id}`}
						className="block p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50"
					>
						{related.names[0]?.name}
					</Link>
				))}
			</div>
		</ProductSection>
	);
}