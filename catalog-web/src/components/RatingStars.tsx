
interface RatingStarsProps {
	rating: number;
	size?: number;
}

export function RatingStars({rating, size = 20}: RatingStarsProps) {
	const clampedRating = Math.max(0, Math.min(5, rating));

	return (
		<div className="flex items-center gap-0.5">
			{Array.from({length: 5}, (_, index) => {
				const fill = Math.max(0, Math.min(1, clampedRating - index));

				return (
					<svg
						key={index}
						width={size}
						height={size}
						viewBox="0 0 24 24"
						className="shrink-0"
					>
						<path
							d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="text-zinc-300"
						/>

						{fill > 0 && (
							<path
								d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"
								fill="currentColor"
								className="text-amber-500"
								clipPath={`inset(0 ${(1 - fill) * 100}% 0 0)`}
							/>
						)}
					</svg>
				);
			})}
		</div>
	);
}
