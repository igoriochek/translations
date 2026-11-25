
import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";
import {strings} from "../../utils/localization.ts";

interface ProductCertificationsSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductCertificationsSection({product, onEdit}: ProductCertificationsSectionProps) {
	return (
		<ProductSection title={strings.certifications_title} onEdit={onEdit}>
			{product.certifications.length === 0 ? (
				<p className="text-sm text-zinc-500">
					No quality labels assigned.
				</p>
			) : (
				<div className="flex flex-wrap gap-4">
					{product.certifications.map((certification) => (
						<div
							key={certification.id}
							className="relative group w-16 h-16 shrink-0"
						>
							<img
								src={certification.badge_url}
								alt={certification.label}
								className="block w-16 aspect-square object-contain"
							/>

							<div className="
                                absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                whitespace-nowrap rounded-md bg-zinc-900 px-3 py-1.5
                                text-sm text-white shadow-lg
                                opacity-0 invisible pointer-events-none
                                group-hover:opacity-100 group-hover:visible
                                transition-all duration-150 z-50
                            ">
								{certification.label}

								<div className="
                                    absolute top-full left-1/2 -translate-x-1/2
                                    border-4 border-transparent border-t-zinc-900
                                "/>
							</div>
						</div>
					))}
				</div>
			)}
		</ProductSection>
	);
}
