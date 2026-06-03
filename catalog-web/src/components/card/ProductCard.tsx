import type {ProductListItem} from "../../api/types.ts";

import {useNavigate} from "react-router-dom";

interface ProductCardProps {
	product: ProductListItem;
}

export default function ProductCard({product}: ProductCardProps) {

	const navigate = useNavigate();

	const primaryName = product.names[0];
	const primaryImage = product.images[0];

	return (
		<button
			onClick={() => navigate(`/products/${product.id}`)}
			className="
                bg-white
                rounded-2xl
                border
                border-zinc-100
                shadow-sm
                overflow-hidden
                text-left
                transition-all
                hover:shadow-md
                hover:-translate-y-0.5
            "
		>
			<div
				className="
                    aspect-4/3
                    bg-zinc-50
					overflow-hidden
                    flex
                    items-center
                    justify-center
                "
			>
				{primaryImage ? (
					<img
						src={primaryImage.image_url}
						alt={primaryName?.name}
						loading="lazy"
						className="
                            w-full
                            h-full
                            object-cover
                            p-4
                        "
					/>
				) : (
					<div className="text-sm text-zinc-400">
						No Image
					</div>
				)}
			</div>

			<div className="p-5 space-y-4">
				<div>
					<h2 className="font-semibold text-lg line-clamp-2">
						{primaryName?.name ?? 'Unnamed Product'}
					</h2>

					<p className="text-sm text-zinc-500 mt-1">
						{product.manufacturer?.name ?? 'No manufacturer'}
					</p>
				</div>

				<div
					className="
                        flex
                        flex-wrap
                        gap-2
                        min-h-[28px]
                    "
				>
					{product.categories
						.slice(0, 3)
						.map((category) => {
							const categoryName = category.names[0];
							return (
								<div
									key={category.id}
									className="
										px-2.5
										py-1
										rounded-full
										bg-zinc-100
										text-zinc-600
										text-xs
										font-medium
									"
								>
									{categoryName?.name ?? 'Unnamed'}
								</div>
							);
						})}
				</div>
			</div>
		</button>
	);
}