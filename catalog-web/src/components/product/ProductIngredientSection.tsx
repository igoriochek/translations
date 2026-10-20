import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";
import {formatUnit} from "../../utils/units.ts";
import {strings} from "../../utils/localization.ts";

interface ProductIngredientsSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductIngredientsSection({product, onEdit}: ProductIngredientsSectionProps) {
	return (
		<ProductSection title={strings.ingredients_title} onEdit={onEdit}>
			<div className="space-y-2">
				{product.ingredients.map((ingredient) => (
					<div
						key={ingredient.id}
						className="flex items-center justify-between p-3 rounded-xl border border-zinc-200"
					>
						<span>{ingredient.ingredient.names[0]?.name}</span>
						<span>{ingredient.amount} {formatUnit(ingredient.unit_type.type)}</span>
					</div>
				))}
			</div>
		</ProductSection>
	);
}