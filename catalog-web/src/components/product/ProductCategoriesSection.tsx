import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";
import {strings} from "../../utils/localization.ts";

interface ProductCategoriesSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductCategoriesSection({product, onEdit}: ProductCategoriesSectionProps) {
	return (
		<ProductSection title={strings.categories_title} onEdit={onEdit}>
			<div className="flex flex-wrap gap-2">
				{product.categories.map((category) => (
					<div key={category.id} className="bg-zinc-100 px-3 py-1 rounded-full text-sm">
						{category.names[0]?.name}
					</div>
				))}
			</div>
		</ProductSection>
	);
}