import {useState} from "react";
import type {
	Category,
	Manufacturer
} from "../api/types.ts";
import FilterGroup from "./FilterGroup.tsx";
import {strings} from "../utils/localization.ts";

interface ProductFiltersProps {
	manufacturers: Manufacturer[];
	categories: Category[];
	selectedManufacturerIds: number[];
	selectedCategoryIds: number[];
	onManufacturerChange: (ids: number[]) => void;
	onCategoryChange: (ids: number[]) => void;
}

export default function ProductFilters({
										   manufacturers,
										   categories,
										   selectedManufacturerIds,
										   selectedCategoryIds,
										   onManufacturerChange,
										   onCategoryChange
									   }: ProductFiltersProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative">
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="
					px-4
					py-3
					rounded-xl
					border
					border-zinc-200
					bg-white
					shadow-sm
					text-sm
				"
			>
				{strings.products.filters_button}
			</button>

			{open && (
				<div
					className="
						absolute
						right-0
						top-full
						mt-2
						w-80
						bg-white
						border
						border-zinc-200
						rounded-xl
						shadow-lg
						p-4
						z-50
						space-y-6
					"
				>
					<FilterGroup
						title={strings.manufacturers_title}
						options={manufacturers.map((x) => ({
							id: x.id,
							label: x.name
						}))}
						selectedIds={selectedManufacturerIds}
						onChange={onManufacturerChange}
					/>

					<FilterGroup
						title={strings.categories_title}
						options={categories.map((x) => ({
							id: x.id,
							label: x.names[0]?.name ?? `${strings.missing_field} #${x.id}`
						}))}
						selectedIds={selectedCategoryIds}
						onChange={onCategoryChange}
					/>
				</div>
			)}
		</div>
	);
}