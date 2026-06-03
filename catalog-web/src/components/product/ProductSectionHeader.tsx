interface ProductSectionHeaderProps {
	title: string;
	onEdit?: () => void;
}

export default function ProductSectionHeader({
												 title,
												 onEdit
											 }: ProductSectionHeaderProps) {
	return (
		<div className="flex items-center justify-between mb-4">

			<h2 className="text-lg font-semibold">
				{title}
			</h2>

			{onEdit && (
				<button onClick={onEdit} className="text-sm text-zinc-500 hover:text-black">
					Edit
				</button>
			)}

		</div>
	);
}