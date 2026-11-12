import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";
import {getLocalizedField, strings} from "../../utils/localization.ts";
import {useLanguage} from "../../utils/LanguageContext.tsx";

interface ProductCategoriesSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductCategoriesSection({product, onEdit}: ProductCategoriesSectionProps) {
	const {language} = useLanguage();

	return (
		<ProductSection title={strings.categories_title} onEdit={onEdit}>
			<div className="flex flex-wrap gap-2">
				{product.categories.map((category) => {
					const primaryName =
						getLocalizedField(language, category.names.map(x => { return {
							language: x.language, field: x.name
						}}));

					return (
						<div key={category.id} className="bg-zinc-100 px-3 py-1 rounded-full text-sm">
							{primaryName?.field ?? strings.missing_field}
						</div>
					)
				})}
			</div>
		</ProductSection>
	);
}