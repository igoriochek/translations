import type {Product} from "../../api/types";

interface ProductUsageInstructionsSectionProps {
	product: Product;
	onEdit: () => void;
}

export default function ProductUsageInstructionsSection({
															product,
															onEdit
														}: ProductUsageInstructionsSectionProps) {
	return (
		<section className="bg-white rounded-2xl shadow-sm p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold">
					Usage Instructions
				</h2>

				<button
					onClick={onEdit}
					className="text-sm text-blue-600 font-medium"
				>
					Edit
				</button>
			</div>

			{product.usage_instructions.length === 0 ? (
				<p className="text-zinc-500">
					No usage instructions.
				</p>
			) : (
				<div className="space-y-4">
					{product.usage_instructions.map(
						instruction => (
							<div
								key={instruction.id}
								className="border rounded-lg p-4"
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
		</section>
	);
}