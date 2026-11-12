import type {Recipe} from "../../api/types.ts";
import {Pencil, Trash2} from "lucide-react";
import {getLocalizedField, strings} from "../../utils/localization.ts";
import {useLanguage} from "../../utils/LanguageContext.tsx";

interface RecipeCardProps {
	recipe: Recipe;

	onEdit?: () => void;
	onDelete?: () => void;
}

export default function RecipeCard({recipe, onEdit, onDelete}: RecipeCardProps) {

	const {language} = useLanguage();


	const primaryName =
		getLocalizedField(language, recipe.names.map(x => { return {
			language: x.language, field: x.name
		}}));

	return (
		<div className="bg-white rounded-xl border border-zinc-100 shadow-sm px-5 py-4">

			<div className="flex items-center justify-between">

				<div>
					<h2 className="font-semibold">
						{primaryName?.field ?? strings.missing_field}
					</h2>

					<p className="text-sm text-zinc-500 mt-1">
						{recipe.contents.length}
						{' '}
						{recipe.contents.length == 1 ?
							strings.translation.toLowerCase() :
							strings.translations.toLowerCase()}
					</p>

					<p className="text-sm text-zinc-500">
						{recipe.ingredients.length}
						{' '}
						{recipe.ingredients.length == 1 ?
							strings.recipes.ingredient.toLowerCase() :
							strings.recipes.ingredients.toLowerCase()}
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