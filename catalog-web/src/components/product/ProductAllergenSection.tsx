import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";
import {getLocalizedField, strings} from "../../utils/localization.ts";
import { useLanguage } from "../../utils/LanguageContext.tsx";

interface ProductAllergensSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductAllergensSection({product, onEdit}: ProductAllergensSectionProps) {
	const {language} = useLanguage();

	return (
		<ProductSection title={strings.allergens_title} onEdit={onEdit}>
			<div className="flex flex-wrap gap-2">
				{product.allergens.map((allergen) => {
					const primaryName =
						getLocalizedField(language, allergen.names.map(x => { return {
							language: x.language, field: x.name
						}}));

					return (
						<div key={allergen.id} className="bg-zinc-100 px-3 py-1 rounded-full text-sm">
							{primaryName?.field ?? strings.missing_field}
						</div>
					)
				})}
			</div>
		</ProductSection>
	);
}