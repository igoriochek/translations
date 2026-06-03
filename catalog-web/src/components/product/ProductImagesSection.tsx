import type {Product} from "../../api/types.ts";
import ProductSection from "./ProductSection.tsx";

interface ProductImagesSectionProps {
	product: Product;
	onEdit?: () => void;
}

export default function ProductImagesSection({product, onEdit}: ProductImagesSectionProps) {
	return (
		<ProductSection title="Images" onEdit={onEdit}>
			<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
				{product.images.map((image) => (
					<img
						key={image.id}
						src={image.image_url}
						alt=""
						className="aspect-square object-cover rounded-xl border border-zinc-200"
					/>
				))}
			</div>
		</ProductSection>
	);
}