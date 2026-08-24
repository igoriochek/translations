export interface MeasurementTableRow {
	id: number;
	label: string;
	amount: number;
	unit: string;
}

interface MeasurementTableProps {
	rows: MeasurementTableRow[];
	onAmountChange: (id: number, amount: number) => void;
	onUnitChange: (id: number, unit: string) => void;
	onDelete: (id: number) => void;
}

const units = [
	'(none)',
	'g',
	'kg',
	'oz',
	'lb',

	'ml',
	'l',
	'fl oz',

	'pcs'
];

export default function MeasurementTable({
											 rows,
											 onAmountChange,
											 onUnitChange,
											 onDelete
										 }: MeasurementTableProps) {

	return (
		<div className="space-y-2">
			{rows.map((row) => (
				<div
					key={row.id}
					className="grid grid-cols-[1fr_120px_100px_40px] gap-3 items-center p-3 border border-zinc-200 rounded-xl"
				>
					<span>{row.label}</span>
					<input
						type="number"
						value={row.amount}
						onChange={(e) =>
							onAmountChange(row.id, Number(e.target.value))
						}
						className="border border-zinc-200 rounded-lg px-3 py-2"
					/>

					<select
						value={row.unit}
						onChange={(e) => onUnitChange(row.id, e.target.value)}
						className="border border-zinc-200 rounded-lg px-3 py-2"
					>
						{units.map((unit) => (
							<option key={unit} value={unit}>
								{unit}
							</option>
						))}
					</select>

					<button type="button" onClick={() => onDelete(row.id)} className="text-red-500">
						×
					</button>
				</div>
			))}
		</div>
	);
}