export default function AllergenSkeleton() {

	return (
		<div
			className="
                bg-white
                rounded-xl
                border border-zinc-100
                shadow-sm
                px-5
                py-4
                animate-pulse
            "
		>

			<div className="flex items-center justify-between">

				<div className="space-y-2">

					<div
						className="
                            h-5
                            w-32
                            bg-zinc-200
                            rounded
                        "
					/>

					<div
						className="
                            h-4
                            w-24
                            bg-zinc-100
                            rounded
                        "
					/>

				</div>

				<div className="flex gap-3">

					<div
						className="
                            h-5
                            w-5
                            bg-zinc-200
                            rounded
                        "
					/>

					<div
						className="
                            h-5
                            w-5
                            bg-zinc-200
                            rounded
                        "
					/>

				</div>

			</div>

		</div>
	);
}