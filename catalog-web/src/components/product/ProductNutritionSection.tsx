import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";
import {formatUnit} from "../../utils/units.ts";
import {getLocalizedField, strings} from "../../utils/localization.ts";
import {useLanguage} from "../../utils/LanguageContext.tsx";

interface ProductNutritionSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductNutritionSection({product, onEdit}: ProductNutritionSectionProps) {
	const {language} = useLanguage();

	return (
		<ProductSection title={strings.products.nutritional_facts} onEdit={onEdit}>
			<div className="space-y-2">
				{product.nutritional_measurements.map((measurement) => {
					const primaryName =
						getLocalizedField(language, measurement.type.labels.map(x => { return {
							language: x.language, field: x.label
						}}));

					return (
						<div
							key={measurement.id}
							className="flex items-center justify-between p-3 rounded-xl border border-zinc-200"
						>
							<span>{primaryName?.field ?? strings.missing_field}</span>

							<span>{measurement.amount} {formatUnit(measurement.unit_type.type)}</span>
						</div>
					)
				})}
			</div>
		</ProductSection>
	);
}