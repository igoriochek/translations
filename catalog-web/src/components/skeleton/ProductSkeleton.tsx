export default function ProductSkeleton() {

	return (
		<div
			className="
                bg-white
                rounded-2xl
                border
                border-zinc-100
                shadow-sm
                overflow-hidden
                animate-pulse
            "
		>

			<div
				className="
                    aspect-[9/5]
                    bg-zinc-100
                "
			/>

			<div className="p-5 space-y-4">

				<div>

					<div
						className="
                            h-6
                            w-40
                            bg-zinc-200
                            rounded
                        "
					/>

					<div
						className="
                            h-4
                            w-28
                            bg-zinc-100
                            rounded
                            mt-2
                        "
					/>

				</div>

				<div
					className="
                        flex
                        flex-wrap
                        gap-2
                    "
				>

					<div
						className="
                            h-6
                            w-16
                            rounded-full
                            bg-zinc-100
                        "
					/>

					<div
						className="
                            h-6
                            w-20
                            rounded-full
                            bg-zinc-100
                        "
					/>

					<div
						className="
                            h-6
                            w-14
                            rounded-full
                            bg-zinc-100
                        "
					/>

				</div>

			</div>

		</div>
	);
}