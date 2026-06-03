import ProductSectionHeader from "./ProductSectionHeader.tsx";

interface ProductSectionProps {
	title: string;
	onEdit?: () => void;
	children: React.ReactNode;
}

export default function ProductSection({
										   title,
										   onEdit,
										   children
									   }: ProductSectionProps) {
	return (
		<div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">

			<ProductSectionHeader title={title} onEdit={onEdit} />

			{children}

		</div>
	);
}