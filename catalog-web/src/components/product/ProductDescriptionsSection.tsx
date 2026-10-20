import type {Product} from "../../api/types";
import ProductSection from "./ProductSection.tsx";
import {strings} from "../../utils/localization.ts";

interface ProductDescriptionsSectionProps {
	product: Product;
	onEdit: () => void;
}

export default function ProductDescriptionsSection({
															product,
															onEdit
														}: ProductDescriptionsSectionProps) {
	return (
		<ProductSection title={strings.products.descriptions_field} onEdit={onEdit}>

			{product.usage_instructions.length === 0 ? (
				<p className="text-zinc-500">
					No descriptions.
				</p>
			) : (
				<div className="space-y-4">
					{product.descriptions.map(
						instruction => (
							<div
								key={instruction.id}
								className="p-4 rounded-xl border border-zinc-200"
							>
								<div className="text-sm font-medium text-zinc-500 mb-2">
									{instruction.language.name}
								</div>

								<p>
									{instruction.description}
								</p>
							</div>
						)
					)}
				</div>
			)}
		</ProductSection>
	);
}