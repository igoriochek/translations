import type {Image} from "../../api/types.ts";

interface ProductImageGridProps {
	images: Image[];
	onDelete?: (id: number) => void;
}

export default function ProductImageGrid({
											 images,
											 onDelete
										 }: ProductImageGridProps) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
			{images.map((image) => (
				<div key={image.id} className="relative">
					<img
						src={image.image_url}
						alt=""
						className="w-full aspect-square object-cover rounded-xl border border-zinc-200"
					/>

					{onDelete && (
						<button
							type="button"
							onClick={() => onDelete(image.id)}
							className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 shadow text-red-500"
						>
							×
						</button>
					)}
				</div>
			))}
		</div>
	);
}