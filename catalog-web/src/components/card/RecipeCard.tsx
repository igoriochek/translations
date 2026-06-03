import type {Recipe} from "../../api/types.ts";
import {Pencil, Trash2} from "lucide-react";

interface RecipeCardProps {
	recipe: Recipe;

	onEdit?: () => void;
	onDelete?: () => void;
}

export default function RecipeCard({recipe, onEdit, onDelete}: RecipeCardProps) {

	const primaryName =
		recipe.names.find((x) => x.language.code === 'en') ?? recipe.names[0];

	return (
		<div className="bg-white rounded-xl border border-zinc-100 shadow-sm px-5 py-4">

			<div className="flex items-center justify-between">

				<div>
					<h2 className="font-semibold">
						{primaryName?.name ?? 'Unnamed'}
					</h2>

					<p className="text-sm text-zinc-500 mt-1">
						{recipe.contents.length} translations
					</p>

					<p className="text-sm text-zinc-500">
						{recipe.ingredients.length} ingredients
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={onEdit}
						className="text-zinc-500 hover:text-black transition"
					>
						<Pencil size={18}/>
					</button>

					<button
						onClick={onDelete}
						className="text-zinc-500 hover:text-red-500 transition"
					>
						<Trash2 size={18}/>
					</button>
				</div>
			</div>
		</div>
	);
}