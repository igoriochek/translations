import type {ProductReview} from "../../api/types.ts";
import type {RowComponentProps} from "react-window";

export interface ReviewRowData {
	reviews: ProductReview[];
}

export function ReviewRow({
							  index,
							  style,
							  reviews
						  }: RowComponentProps<ReviewRowData>) {
	const review = reviews[index];

	return (
		<div style={style} className="pb-2">
			<div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-zinc-200">
				<div className="min-w-0">
					<p className="font-medium truncate">
						{review.user.name}
					</p>
					<p className="text-sm text-zinc-500 truncate">
						{review.title}
					</p>
				</div>

				<div className="flex items-center gap-1 shrink-0">
					<span className="text-amber-500">★</span>
					<span className="font-medium">
                        {review.rating}/5
                    </span>
				</div>
			</div>
		</div>
	);
}