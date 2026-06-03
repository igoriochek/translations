import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";

interface ProductAllergensSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductAllergensSection({product, onEdit}: ProductAllergensSectionProps) {
	return (
		<ProductSection title="Allergens" onEdit={onEdit}>
			<div className="flex flex-wrap gap-2">
				{product.allergens.map((allergen) => (
					<div key={allergen.id} className="bg-zinc-100 px-3 py-1 rounded-full text-sm">
						{allergen.names[0]?.name}
					</div>
				))}
			</div>
		</ProductSection>
	);
}