import {useState} from "react";
import type {Recipe, RecipeRequest} from "../../api/types.ts";
import {updateRecipe} from "../../api/recipes.ts";
import RecipeForm from "../RecipeForm.tsx";
import {strings} from "../../utils/localization.ts";

interface EditRecipeModalProps {
	open: boolean;
	recipe: Recipe | null;
	onClose: () => void;
	onUpdated: (recipe: Recipe) => void;
}

export default function EditRecipeModal({
											open,
											recipe,
											onClose,
											onUpdated
										}: EditRecipeModalProps) {
	const [loading, setLoading] = useState(false);

	if (!open || !recipe)
		return null;

	async function handleSubmit(request: RecipeRequest) {
		try {
			setLoading(true);

			const updated = await updateRecipe(recipe!.id, request);
			onUpdated(updated);
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl">
				<h2 className="text-xl font-bold mb-6">
					{strings.recipes.edit_label}
				</h2>

				<RecipeForm
					recipe={recipe}
					loading={loading}
					submitText={strings.save_button}
					onSubmit={handleSubmit}
					onCancel={onClose}
				/>
			</div>
		</div>
	);
}