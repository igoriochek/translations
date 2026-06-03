export default function ProductPageSkeleton() {
	return (
		<div className="space-y-6 animate-pulse">

			<div className="space-y-2">
				<div className="h-8 w-64 bg-zinc-200 rounded"/>
				<div className="h-5 w-40 bg-zinc-100 rounded"/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

				{Array.from({length: 6}).map((_, index) => (
					<div
						key={index}
						className="
							bg-white
							rounded-2xl
							border
							border-zinc-100
							shadow-sm
							p-6
							h-48
						"
					/>
				))}

			</div>

		</div>
	);
}