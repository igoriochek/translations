import type {SellerProduct} from "../api/types.ts";
import {ChevronRight, Trash2} from "lucide-react";
import {strings} from "../utils/localization.ts";

interface SellerProductRowProps {
	product: SellerProduct;

	selected: boolean;

	onSelect: () => void;
	onDelete: () => void;
}

export default function SellerProductRow({
											 product,
											 selected,
											 onSelect,
											 onDelete
										 }: SellerProductRowProps) {
	const name = product.product.names[0]?.name ?? "Unnamed Product";

	return (
		<div
			className={`
				flex
				items-center
				gap-2
				rounded-lg
				border
				px-3
				py-2
				cursor-pointer
				transition

				${selected
				? "border-black bg-zinc-50"
				: "border-zinc-200 hover:bg-zinc-50"
			}
			`}
			onClick={onSelect}
		>
			<div className="flex-1">
				<p className="text-sm font-medium">
					{name}
				</p>

				<p className="text-xs text-zinc-500">
					{product.recommendations.length}
					{" "}
					{product.recommendations.length == 1 ?
						strings.recommendation.toLowerCase() :
						strings.recommendations.toLowerCase()}
				</p>
			</div>

			<ChevronRight
				size={16}
				className="text-zinc-400"
			/>

			<button
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
				className="
					text-zinc-500
					hover:text-red-500
				"
			>
				<Trash2 size={16}/>
			</button>
		</div>
	);
}