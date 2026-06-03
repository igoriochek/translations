import ProductSection from "./ProductSection.tsx";

interface ProductDangerZoneSectionProps {
	onDelete?: () => void;
}

export default function ProductDangerZoneSection({onDelete}: ProductDangerZoneSectionProps) {
	return (
		<ProductSection title="Danger Zone">
			<p className="text-sm text-zinc-600">
				This action cannot be undone.
			</p>

			<button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded-xl">
				Delete Product
			</button>
		</ProductSection>
	);
}