import type { Allergen } from "../../api/types.ts";
import { Pencil, Trash2 } from "lucide-react";
import {strings} from "../../utils/localization.ts";

interface AllergenCardProps {
	allergen: Allergen;
	onEdit?: () => void;
	onDelete?: () => void;
}

export default function AllergenCard({ allergen, onEdit, onDelete }: AllergenCardProps) {

	const primaryName =
		allergen.names.find((x) => x.language.code === 'en') ?? allergen.names[0];

	return (
		<div
			className="
                bg-white
                rounded-xl
                border border-zinc-100
                shadow-sm
                px-5
                py-4
            "
		>

			<div className="flex items-center justify-between">

				<div>

					<h2 className="font-semibold">
						{primaryName?.name ??
							strings.missing_field}
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						{allergen.names.length}
						{' '}
						{allergen.names.length == 1 ?
							strings.translation.toLowerCase() :
							strings.translations.toLowerCase()}
					</p>

				</div>

				<div className="flex items-center gap-3">

					<button
						onClick={onEdit}
						className="
                            text-zinc-500
                            hover:text-black
                            transition
                        "
					>

						<Pencil size={18}/>

					</button>

					<button
						onClick={onDelete}
						className="
                            text-zinc-500
                            hover:text-red-500
                            transition
                        "
					>

						<Trash2 size={18}/>

					</button>

				</div>

			</div>

		</div>
	);
}