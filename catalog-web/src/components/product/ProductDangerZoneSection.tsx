import ProductSection from "./ProductSection.tsx";
import {strings} from "../../utils/localization.ts";

interface ProductDangerZoneSectionProps {
	onDelete?: () => void;
}

export default function ProductDangerZoneSection({onDelete}: ProductDangerZoneSectionProps) {
	return (
		<ProductSection title={strings.products.danger_zone}>
			<p className="text-sm text-zinc-600">
				{strings.products.danger_zone_hint}
			</p>

			<button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded-xl">
				{strings.products.delete_button}
			</button>
		</ProductSection>
	);
}