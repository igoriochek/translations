import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";
import {formatUnit} from "../../utils/units.ts";

interface ProductNutritionSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductNutritionSection({product, onEdit}: ProductNutritionSectionProps) {
	return (
		<ProductSection title="Nutrition" onEdit={onEdit}>
			<div className="space-y-2">
				{product.nutritional_measurements.map((measurement) => (
					<div
						key={measurement.id}
						className="flex items-center justify-between p-3 rounded-xl border border-zinc-200"
					>
						<span>{measurement.type.labels[0]?.label}</span>

						<span>{measurement.amount} {formatUnit(measurement.unit_type.type)}</span>
					</div>
				))}
			</div>
		</ProductSection>
	);
}