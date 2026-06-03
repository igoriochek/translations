interface FilterOption {
	id: number;
	label: string;
}

interface FilterGroupProps {
	title: string;
	options: FilterOption[];
	selectedIds: number[];
	onChange: (ids: number[]) => void;
}

const ALL_ID = -1;

export default function FilterGroup({
										title,
										options,
										selectedIds,
										onChange
									}: FilterGroupProps) {

	const displayOptions = [
		{
			id: ALL_ID,
			label: 'All'
		},
		...options
	];

	function isChecked(id: number) {
		if (id === ALL_ID) {
			return (
				options.length > 0 &&
				selectedIds.length === options.length
			);
		}

		return selectedIds.includes(id);
	}

	function toggle(id: number) {
		if (id === ALL_ID) {
			const allSelected = selectedIds.length === options.length;
			if (allSelected) {
				onChange([]);
				return;
			}

			onChange(options.map((x) => x.id));
			return;
		}

		const updated = selectedIds.includes(id)
			? selectedIds.filter((x) => x !== id)
			: [
				...selectedIds,
				id
			];

		onChange(updated);
	}

	return (
		<div className="space-y-3">
			<h3 className="text-sm font-medium">
				{title}
			</h3>

			<div className="space-y-2">
				{displayOptions.map((option) => (
					<label key={option.id} className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={isChecked(option.id)}
							onChange={() => toggle(option.id)}
						/>

						<span className="text-sm">
							{option.label}
						</span>
					</label>
				))}
			</div>
		</div>
	);
}