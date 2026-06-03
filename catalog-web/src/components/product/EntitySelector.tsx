import {useMemo, useState} from "react";

export interface EntitySelectorItem {
	id: number;
	label: string;
}

interface EntitySelectorProps {
	label: string;
	items: EntitySelectorItem[];
	selectedIds: number[];
	onChange: (ids: number[]) => void;
	searchPlaceholder?: string;
}

export default function EntitySelector({
										   label,
										   items,
										   selectedIds,
										   onChange,
										   searchPlaceholder = "Search..."
									   }: EntitySelectorProps) {
	const [search, setSearch] = useState("");

	const filteredItems = useMemo(() => {
		if (!search.trim())
			return items;

		return items.filter((item) =>
			item.label.toLowerCase().includes(search.toLowerCase())
		);
	}, [items, search]);

	function addItem(id: number) {
		if (selectedIds.includes(id))
			return;

		onChange([
			...selectedIds,
			id
		]);
	}

	function removeItem(id: number) {
		onChange(selectedIds.filter((x) => x !== id));
	}

	return (
		<div className="space-y-4">
			<h3 className="text-sm font-medium">{label}</h3>
			<input
				type="text"
				value={search}
				onChange={(e) =>
					setSearch(e.target.value)
				}
				placeholder={searchPlaceholder}
				className="w-full border border-zinc-200 rounded-xl px-4 py-3"
			/>

			<div className="max-h-48 overflow-y-auto border border-zinc-200 rounded-xl">
				{filteredItems.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => addItem(item.id)}
						className="w-full text-left px-4 py-2 hover:bg-zinc-100"
					>
						{item.label}
					</button>
				))}
			</div>

			<div className="flex flex-wrap gap-2">
				{selectedIds.map((id) => {
					const item = items.find((x) => x.id === id);

					if (!item)
						return null;

					return (
						<div key={id} className="flex items-center gap-2 bg-zinc-100 rounded-full px-3 py-1">
							<span>{item.label}</span>
							<button type="button" onClick={() => removeItem(id)}>
								×
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}