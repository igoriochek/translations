import {Link} from "react-router-dom";

import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";
import {getLocalizedField, strings} from "../../utils/localization.ts";
import {useLanguage} from "../../utils/LanguageContext.tsx";

interface ProductRelatedProductsSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductRelatedProductsSection({product, onEdit}: ProductRelatedProductsSectionProps) {
	const {language} = useLanguage();

	return (
		<ProductSection title={strings.products.related_products} onEdit={onEdit}>
			<div className="space-y-2">
				{product.related_products.map((related) => {
					const primaryName =
						getLocalizedField(language, related.names.map(x => { return {
							language: x.language, field: x.name
						}}));

					return (
                        <Link
                            key={related.id}
                            to={`/products/${related.id}`}
                            className="block p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50"
                        >
                            {primaryName?.field ?? strings.missing_field}
                        </Link>
                    )
				})}
			</div>
		</ProductSection>
	);
}