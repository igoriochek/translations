import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";
import {formatUnit} from "../../utils/units.ts";
import {getLocalizedField, strings} from "../../utils/localization.ts";
import {useLanguage} from "../../utils/LanguageContext.tsx";

interface ProductIngredientsSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductIngredientsSection({product, onEdit}: ProductIngredientsSectionProps) {
	const {language} = useLanguage();

	return (
		<ProductSection title={strings.ingredients_title} onEdit={onEdit}>
			<div className="space-y-2">
				{product.ingredients.map((ingredient) => {
					const primaryName =
						getLocalizedField(language, ingredient.ingredient.names.map(x => { return {
							language: x.language, field: x.name
						}}));

					return (
						<div
							key={ingredient.id}
							className="flex items-center justify-between p-3 rounded-xl border border-zinc-200"
						>
							<span>{primaryName?.field ?? strings.missing_field}</span>
							<span>{ingredient.amount} {formatUnit(ingredient.unit_type.type)}</span>
						</div>
					)
				})}
			</div>
		</ProductSection>
	);
}