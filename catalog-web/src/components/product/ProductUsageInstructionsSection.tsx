import type {Product} from "../../api/types";
import ProductSection from "./ProductSection.tsx";
import {strings} from "../../utils/localization.ts";

interface ProductUsageInstructionsSectionProps {
	product: Product;
	onEdit: () => void;
}

export default function ProductUsageInstructionsSection({
															product,
															onEdit
														}: ProductUsageInstructionsSectionProps) {
	return (
		<ProductSection title={strings.products.usage_instructions_field} onEdit={onEdit}>
			{product.usage_instructions.length === 0 ? (
				<p className="text-zinc-500">
					{strings.products.no_usage_instructions}
				</p>
			) : (
				<div className="space-y-4">
					{product.usage_instructions.map(
						instruction => (
							<div
								key={instruction.id}
								className="p-4 rounded-xl border border-zinc-200"
							>
								<div className="text-sm font-medium text-zinc-500 mb-2">
									{instruction.language.name}
								</div>

								<p>
									{instruction.content}
								</p>
							</div>
						)
					)}
				</div>
			)}
		</ProductSection>
	);
}