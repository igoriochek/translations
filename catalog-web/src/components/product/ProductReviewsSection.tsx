
import type {Product} from "../../api/types.ts";
import {List} from "react-window";
import {ReviewRow} from "../card/ProductReviewCard.tsx";
import {RatingStars} from "../RatingStars.tsx";
import {strings} from "../../utils/localization.ts";

interface ProductReviewsSectionProps {
	product: Product;
}

export default function ProductReviewsSection({product}: ProductReviewsSectionProps) {
	const reviews = product.reviews ?? [];

	const reviewCount = reviews.length;

	const averageRating = reviewCount > 0
		? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
		: 0;

	const recommendedCount = reviews.filter(review => review.recommended).length;

	const recommendationPercentage = reviewCount > 0
		? (recommendedCount / reviewCount) * 100
		: 0;

	const purchasedReviews = reviews.filter(review => review.purchased);

	const purchasedRecommendationCount = purchasedReviews.filter(
		review => review.recommended
	).length;

	const purchasedRecommendationPercentage = purchasedReviews.length > 0
		? (purchasedRecommendationCount / purchasedReviews.length) * 100
		: 0;

	return (
		<section className="bg-white rounded-2xl shadow-sm p-6">
			<h2 className="text-xl font-semibold mb-4">
				{strings.reviews.title}
			</h2>

			{reviewCount === 0 ? (
				<p className="text-zinc-500">
					{strings.reviews.no_reviews}
				</p>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
						<div className="rounded-xl bg-zinc-50 p-4">
							<p className="text-sm text-zinc-500 mb-1">
								{strings.reviews.avg_rating}
							</p>
							<p className="text-2xl font-semibold">
								{averageRating.toFixed(1)} / 5
							</p>
							<RatingStars rating={averageRating} size={18}/>
						</div>

						<div className="rounded-xl bg-zinc-50 p-4">
							<p className="text-sm text-zinc-500 mb-1">
								{strings.reviews.recommended_by}
							</p>
							<p className="text-2xl font-semibold">
								{recommendationPercentage.toFixed(1)}%
							</p>
							<p className="text-sm text-zinc-500">
								{recommendedCount} {strings.reviews.of} {reviewCount} {strings.reviews.reviewers.toLowerCase()}
							</p>
						</div>

						<div className="rounded-xl bg-zinc-50 p-4">
							<p className="text-sm text-zinc-500 mb-1">
								{strings.reviews.recommended_by} {strings.reviews.buyers}
							</p>
							<p className="text-2xl font-semibold">
								{purchasedReviews.length > 0
									? `${purchasedRecommendationPercentage.toFixed(1)}%`
									: "N/A"}
							</p>
							<p className="text-sm text-zinc-500">
								{purchasedRecommendationCount} {strings.reviews.of} {purchasedReviews.length} {strings.reviews.buyers.toLowerCase()}
							</p>
						</div>
					</div>

					<div className="mb-4">
						<h3 className="font-semibold mb-2">
							Reviews ({reviewCount})
						</h3>

						<List
							rowComponent={ReviewRow}
							rowCount={reviews.length}
							rowHeight={76}
							rowProps={{reviews}}
							style={{height: 300, width: "100%"}}
						/>
					</div>
				</>
			)}
		</section>
	);
}
