import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";
import {strings} from "../../utils/localization.ts";

interface ProductNamesSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductNamesSection({product, onEdit}: ProductNamesSectionProps) {
	return (
		<ProductSection title={strings.products.names_field} onEdit={onEdit}>
			<div className="space-y-2">
				{product.names.map((name) => (
					<div
						key={name.id}
						className="flex justify-between items-center p-3 rounded-xl border border-zinc-200"
					>
						<span>{name.language.name}</span>
						<span>{name.name}</span>
					</div>
				))}
			</div>
		</ProductSection>
	);
}