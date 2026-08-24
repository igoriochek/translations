export function formatUnit(unit: string) {
	switch (unit.toLowerCase()) {
		case 'mass':
			return 'g';

		case 'volume':
			return 'ml';

		case 'count':
			return 'pcs';

		case 'none':
			return '';

		default:
			return unit;
	}
}

export function normalizeMeasurement(
	amount: number,
	unit: string
) {

	switch (unit) {

		case 'g':
			return {
				amount,
				unit_type_id: 1
			};

		case 'kg':
			return {
				amount: amount * 1000,
				unit_type_id: 1
			};

		case 'oz':
			return {
				amount: amount * 28.3495,
				unit_type_id: 1
			};

		case 'lb':
			return {
				amount: amount * 453.592,
				unit_type_id: 1
			};

		case 'ml':
			return {
				amount,
				unit_type_id: 2
			};

		case 'l':
			return {
				amount: amount * 1000,
				unit_type_id: 2
			};

		case 'fl oz':
			return {
				amount: amount * 29.5735,
				unit_type_id: 2
			};

		case 'pcs':
			return {
				amount,
				unit_type_id: 3
			};

		case '(none)':
			return {
				amount,
				unit_type_id: 4
			}

		default:
			throw new Error(`Unknown unit ${unit}`);
	}
}